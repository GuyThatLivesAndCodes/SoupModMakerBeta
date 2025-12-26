import {
  EventData,
  EventCondition,
  EventAction,
  MinecraftEventType,
} from '@soupmodmaker/core';

export interface GeneratedEventFiles {
  handlerClass: string;
  registration: string;
}

export class ForgeEventGenerator {
  private modId: string;
  private packageName: string;

  constructor(modId: string) {
    this.modId = modId;
    this.packageName = `com.${modId}.events`;
  }

  generate(event: EventData): GeneratedEventFiles {
    return {
      handlerClass: this.generateHandlerClass(event),
      registration: this.generateRegistration(event),
    };
  }

  private generateHandlerClass(event: EventData): string {
    const className = this.toPascalCase(event.id) + 'Handler';
    const forgeEvent = this.getForgeEventType(event.eventType);
    const imports = this.getRequiredImports(event);

    return `package ${this.packageName};

${imports}
import net.minecraftforge.eventbus.api.SubscribeEvent;
import net.minecraftforge.eventbus.api.EventPriority;
import net.minecraftforge.fml.common.Mod;

@Mod.EventBusSubscriber(modid = "${this.modId}")
public class ${className} {

    @SubscribeEvent(priority = EventPriority.${event.priority.toUpperCase()})
    public static void on${this.toPascalCase(event.eventType)}(${forgeEvent} event) {
${this.generateConditionChecks(event.conditions)}
${this.generateActions(event.actions, event.eventType)}
${event.cancelEvent ? '        event.setCanceled(true);' : ''}
    }
}
`;
  }

  private generateConditionChecks(conditions: EventCondition[]): string {
    if (conditions.length === 0) {
      return '';
    }

    const checks = conditions.map(cond => this.generateConditionCode(cond));

    return `        // Check conditions
        if (!(${checks.join(' &&\n            ')})) {
            return;
        }
\n`;
  }

  private generateConditionCode(condition: EventCondition): string {
    const negation = condition.negate ? '!' : '';

    switch (condition.type) {
      case 'specific_block':
        return `${negation}(event.getState().is(Blocks.${this.toBlockConstant(condition.config.block)}))`;

      case 'specific_entity':
        return `${negation}(event.getEntity() instanceof ${this.getEntityClass(condition.config.entity)})`;

      case 'entity_type':
        return `${negation}(event.getEntity().getType() == EntityType.${this.toScreamingSnakeCase(condition.config.entityType)})`;

      case 'player_gamemode':
        return `${negation}(event.getEntity() instanceof Player player && player.isCreative())`;

      case 'random_chance':
        return `${negation}(event.getLevel().getRandom().nextFloat() < ${condition.config.chance}f)`;

      case 'biome':
        return `${negation}(event.getLevel().getBiome(event.getPos()).is(Biomes.${this.toScreamingSnakeCase(condition.config.biome)}))`;

      case 'weather':
        return `${negation}(event.getLevel().isRaining())`;

      case 'time_of_day':
        const time = condition.config.time || 'day';
        if (time === 'day') {
          return `${negation}(event.getLevel().isDay())`;
        } else {
          return `${negation}(event.getLevel().isNight())`;
        }

      case 'light_level':
        return `${negation}(event.getLevel().getMaxLocalRawBrightness(event.getPos()) >= ${condition.config.level || 8})`;

      case 'player_sneaking':
        return `${negation}(event.getEntity() instanceof Player player && player.isCrouching())`;

      case 'player_has_item':
        return `${negation}(event.getEntity() instanceof Player player && player.getInventory().contains(new ItemStack(Items.${this.toItemConstant(condition.config.item)})))`;

      default:
        return 'true';
    }
  }

  private generateActions(actions: EventAction[], eventType: MinecraftEventType): string {
    if (actions.length === 0) {
      return '';
    }

    const actionCode = actions.map(action => {
      const code = this.generateActionCode(action, eventType);
      if (action.delay && action.delay > 0) {
        return `        // Delayed action (${action.delay}ms)
        event.getLevel().getServer().execute(() -> {
            try { Thread.sleep(${action.delay}); } catch (InterruptedException e) {}
${code}
        });`;
      }
      return code;
    }).join('\n\n');

    return `        // Execute actions
${actionCode}
`;
  }

  private generateActionCode(action: EventAction, eventType: MinecraftEventType): string {
    const indent = action.delay ? '            ' : '        ';

    switch (action.type) {
      case 'explosion':
        const cfg = action.config;
        return `${indent}event.getLevel().explode(
${indent}    null,
${indent}    ${cfg.useEventLocation ? 'event.getPos().getX()' : cfg.x},
${indent}    ${cfg.useEventLocation ? 'event.getPos().getY()' : cfg.y},
${indent}    ${cfg.useEventLocation ? 'event.getPos().getZ()' : cfg.z},
${indent}    ${cfg.power}f,
${indent}    ${cfg.fire ? 'true' : 'false'},
${indent}    ${cfg.breakBlocks ? 'Level.ExplosionInteraction.BLOCK' : 'Level.ExplosionInteraction.NONE'}
${indent});`;

      case 'lightning':
        return `${indent}LightningBolt lightning = EntityType.LIGHTNING_BOLT.create(event.getLevel());
${indent}lightning.moveTo(event.getPos().getX(), event.getPos().getY(), event.getPos().getZ());
${indent}event.getLevel().addFreshEntity(lightning);`;

      case 'spawn_entity':
        const entityType = action.config.entityType || 'minecraft:zombie';
        const count = action.config.count || 1;
        return `${indent}for (int i = 0; i < ${count}; i++) {
${indent}    Entity entity = EntityType.${this.toScreamingSnakeCase(entityType)}.create(event.getLevel());
${indent}    if (entity != null) {
${indent}        entity.moveTo(event.getPos().getX(), event.getPos().getY(), event.getPos().getZ());
${indent}        event.getLevel().addFreshEntity(entity);
${indent}    }
${indent}}`;

      case 'give_item':
        return `${indent}if (event.getEntity() instanceof Player player) {
${indent}    player.getInventory().add(new ItemStack(Items.${this.toItemConstant(action.config.item)}, ${action.config.count || 1}));
${indent}}`;

      case 'send_message':
        const msgType = action.config.type || 'chat';
        const message = action.config.message || '';
        if (msgType === 'title') {
          return `${indent}if (event.getEntity() instanceof ServerPlayer player) {
${indent}    player.displayClientMessage(Component.literal("${message}").withStyle(ChatFormatting.${(action.config.color || 'WHITE').toUpperCase()}), false);
${indent}}`;
        } else if (msgType === 'actionbar') {
          return `${indent}if (event.getEntity() instanceof ServerPlayer player) {
${indent}    player.displayClientMessage(Component.literal("${message}"), true);
${indent}}`;
        } else {
          return `${indent}if (event.getEntity() instanceof Player player) {
${indent}    player.sendSystemMessage(Component.literal("${message}").withStyle(ChatFormatting.${(action.config.color || 'WHITE').toUpperCase()}));
${indent}}`;
        }

      case 'play_sound':
        return `${indent}event.getLevel().playSound(
${indent}    null,
${indent}    event.getPos(),
${indent}    SoundEvents.${this.toScreamingSnakeCase(action.config.sound || 'GENERIC_EXPLODE')},
${indent}    SoundSource.${(action.config.category || 'MASTER').toUpperCase()},
${indent}    ${action.config.volume || 1.0}f,
${indent}    ${action.config.pitch || 1.0}f
${indent});`;

      case 'apply_effect':
        return `${indent}if (event.getEntity() instanceof LivingEntity living) {
${indent}    living.addEffect(new MobEffectInstance(
${indent}        MobEffects.${this.toScreamingSnakeCase(action.config.effect || 'REGENERATION')},
${indent}        ${action.config.duration || 100},
${indent}        ${action.config.amplifier || 0},
${indent}        false,
${indent}        ${action.config.showParticles !== false}
${indent}    ));
${indent}}`;

      case 'set_block':
        return `${indent}event.getLevel().setBlock(
${indent}    event.getPos(),
${indent}    Blocks.${this.toBlockConstant(action.config.block || 'minecraft:air')}.defaultBlockState(),
${indent}    3
${indent});`;

      case 'break_block':
        return `${indent}event.getLevel().destroyBlock(event.getPos(), ${action.config.dropItems !== false});`;

      case 'teleport_entity':
        return `${indent}if (event.getEntity() instanceof Entity entity) {
${indent}    entity.teleportTo(${action.config.x}, ${action.config.y}, ${action.config.z});
${indent}}`;

      case 'damage_entity':
        return `${indent}if (event.getEntity() instanceof LivingEntity living) {
${indent}    living.hurt(event.getLevel().damageSources().generic(), ${action.config.amount || 1.0}f);
${indent}}`;

      case 'heal_entity':
        return `${indent}if (event.getEntity() instanceof LivingEntity living) {
${indent}    living.heal(${action.config.amount || 1.0}f);
${indent}}`;

      case 'set_on_fire':
        return `${indent}if (event.getEntity() instanceof Entity entity) {
${indent}    entity.setSecondsOnFire(${action.config.seconds || 5});
${indent}}`;

      case 'run_command':
        return `${indent}if (event.getLevel() instanceof ServerLevel serverLevel) {
${indent}    serverLevel.getServer().getCommands().performPrefixedCommand(
${indent}        serverLevel.getServer().createCommandSourceStack(),
${indent}        "${action.config.command}"
${indent}    );
${indent}}`;

      case 'spawn_particle':
        return `${indent}if (event.getLevel() instanceof ServerLevel serverLevel) {
${indent}    serverLevel.sendParticles(
${indent}        ParticleTypes.${this.toScreamingSnakeCase(action.config.particle || 'EXPLOSION')},
${indent}        event.getPos().getX(),
${indent}        event.getPos().getY(),
${indent}        event.getPos().getZ(),
${indent}        ${action.config.count || 10},
${indent}        ${action.config.offsetX || 0.5},
${indent}        ${action.config.offsetY || 0.5},
${indent}        ${action.config.offsetZ || 0.5},
${indent}        ${action.config.speed || 0.1}
${indent}    );
${indent}}`;

      default:
        return `${indent}// TODO: Implement ${action.type}`;
    }
  }

  private getRequiredImports(event: EventData): string {
    const imports = new Set<string>([
      'net.minecraft.world.level.Level',
      'net.minecraft.world.entity.player.Player',
      'net.minecraft.core.BlockPos',
    ]);

    // Add imports based on event type
    switch (event.eventType) {
      case 'block_break':
      case 'block_place':
        imports.add('net.minecraft.world.level.block.state.BlockState');
        imports.add('net.minecraft.world.level.block.Blocks');
        imports.add('net.minecraftforge.event.level.BlockEvent');
        break;
      case 'player_join':
      case 'player_quit':
        imports.add('net.minecraftforge.event.entity.player.PlayerEvent');
        break;
      case 'player_death':
        imports.add('net.minecraftforge.event.entity.living.LivingDeathEvent');
        break;
      case 'entity_spawn':
        imports.add('net.minecraftforge.event.entity.living.MobSpawnEvent');
        break;
    }

    // Add imports based on actions
    event.actions.forEach(action => {
      switch (action.type) {
        case 'explosion':
          imports.add('net.minecraft.world.level.Explosion');
          break;
        case 'lightning':
          imports.add('net.minecraft.world.entity.EntityType');
          imports.add('net.minecraft.world.entity.LightningBolt');
          break;
        case 'spawn_entity':
          imports.add('net.minecraft.world.entity.Entity');
          imports.add('net.minecraft.world.entity.EntityType');
          break;
        case 'give_item':
          imports.add('net.minecraft.world.item.ItemStack');
          imports.add('net.minecraft.world.item.Items');
          break;
        case 'send_message':
          imports.add('net.minecraft.network.chat.Component');
          imports.add('net.minecraft.ChatFormatting');
          imports.add('net.minecraft.server.level.ServerPlayer');
          break;
        case 'play_sound':
          imports.add('net.minecraft.sounds.SoundEvents');
          imports.add('net.minecraft.sounds.SoundSource');
          break;
        case 'apply_effect':
          imports.add('net.minecraft.world.effect.MobEffectInstance');
          imports.add('net.minecraft.world.effect.MobEffects');
          imports.add('net.minecraft.world.entity.LivingEntity');
          break;
        case 'spawn_particle':
          imports.add('net.minecraft.core.particles.ParticleTypes');
          imports.add('net.minecraft.server.level.ServerLevel');
          break;
      }
    });

    return Array.from(imports).sort().map(imp => `import ${imp};`).join('\n');
  }

  private getForgeEventType(eventType: MinecraftEventType): string {
    switch (eventType) {
      case 'block_break':
        return 'BlockEvent.BreakEvent';
      case 'block_place':
        return 'BlockEvent.EntityPlaceEvent';
      case 'player_join':
        return 'PlayerEvent.PlayerLoggedInEvent';
      case 'player_quit':
        return 'PlayerEvent.PlayerLoggedOutEvent';
      case 'player_death':
        return 'LivingDeathEvent';
      case 'player_interact':
        return 'PlayerInteractEvent.RightClickBlock';
      case 'entity_spawn':
        return 'MobSpawnEvent.FinalizeSpawn';
      case 'entity_death':
        return 'LivingDeathEvent';
      case 'entity_damage':
        return 'LivingHurtEvent';
      default:
        return 'Event';
    }
  }

  private generateRegistration(event: EventData): string {
    const className = this.toPascalCase(event.id) + 'Handler';

    return `// Event handler registration (automatic with @Mod.EventBusSubscriber)
// The ${className} class will automatically register with the event bus

// If manual registration is needed, add this to your main mod class:
// MinecraftForge.EVENT_BUS.register(${className}.class);
`;
  }

  private toPascalCase(str: string): string {
    return str.split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join('');
  }

  private toScreamingSnakeCase(str: string): string {
    return str.replace('minecraft:', '').toUpperCase().replace(/[:\s]/g, '_');
  }

  private toBlockConstant(blockId: string): string {
    return this.toScreamingSnakeCase(blockId);
  }

  private toItemConstant(itemId: string): string {
    return this.toScreamingSnakeCase(itemId);
  }

  private getEntityClass(entityId: string): string {
    const type = entityId.replace('minecraft:', '');
    return this.toPascalCase(type);
  }
}
