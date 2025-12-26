import { MobData, AIGoal, LootDrop } from '@soupmodmaker/core';

export interface GeneratedMobFiles {
  entity: string;
  renderer: string;
  model: string;
  registration: string;
  spawn: string;
  lootTable: string;
}

export class ForgeMobGenerator {
  private modId: string;
  private minecraftVersion: string;

  constructor(modId: string, minecraftVersion: string = '1.20.4') {
    this.modId = modId;
    this.minecraftVersion = minecraftVersion;
  }

  generate(mob: MobData): GeneratedMobFiles {
    return {
      entity: this.generateEntityClass(mob),
      renderer: this.generateRendererClass(mob),
      model: this.generateModelClass(mob),
      registration: this.generateRegistration(mob),
      spawn: this.generateSpawnConfig(mob),
      lootTable: this.generateLootTable(mob),
    };
  }

  private generateEntityClass(mob: MobData): string {
    const className = this.toPascalCase(mob.id);
    const behaviorType = this.getBehaviorSuperclass(mob.behavior.type);

    return `package com.${this.modId}.entity;

import net.minecraft.world.entity.*;
import net.minecraft.world.entity.ai.attributes.AttributeSupplier;
import net.minecraft.world.entity.ai.attributes.Attributes;
import net.minecraft.world.entity.ai.goal.*;
import net.minecraft.world.entity.monster.Monster;
import net.minecraft.world.entity.animal.Animal;
import net.minecraft.world.level.Level;
import net.minecraft.sounds.SoundEvent;
import net.minecraft.sounds.SoundEvents;
import net.minecraft.world.damagesource.DamageSource;

public class ${className}Entity extends ${behaviorType} {

    public ${className}Entity(EntityType<? extends ${behaviorType}> entityType, Level level) {
        super(entityType, level);
        this.xpReward = ${mob.experience};
    }

    public static AttributeSupplier.Builder createAttributes() {
        return ${behaviorType}.createLivingAttributes()
                .add(Attributes.MAX_HEALTH, ${mob.health}D)
                .add(Attributes.MOVEMENT_SPEED, ${mob.speed}D)
                .add(Attributes.ATTACK_DAMAGE, ${mob.damage}D)
                .add(Attributes.ARMOR, ${mob.armor}D)
                .add(Attributes.ARMOR_TOUGHNESS, ${mob.armorToughness}D)
                .add(Attributes.KNOCKBACK_RESISTANCE, ${mob.knockbackResistance}D)
                .add(Attributes.FOLLOW_RANGE, ${mob.followRange}D);
    }

    @Override
    protected void registerGoals() {
${this.generateAIGoals(mob.aiGoals)}
    }

    @Override
    public boolean isPushable() {
        return ${mob.pushable};
    }

    @Override
    public boolean fireImmune() {
        return ${mob.immuneToFire};
    }

    @Override
    public boolean canBreatheUnderwater() {
        return ${mob.canBreatheUnderwater};
    }

${this.generateSoundMethods(mob)}

    @Override
    public EntityDimensions getDimensions(Pose pose) {
        return EntityDimensions.scalable(${mob.width}F, ${mob.height}F);
    }
}
`;
  }

  private generateAIGoals(goals: AIGoal[]): string {
    const sortedGoals = [...goals].sort((a, b) => a.priority - b.priority);

    return sortedGoals.map(goal => {
      const goalCode = this.getAIGoalCode(goal);
      return `        this.goalSelector.addGoal(${goal.priority}, ${goalCode});`;
    }).join('\n');
  }

  private getAIGoalCode(goal: AIGoal): string {
    switch (goal.type) {
      case 'melee_attack':
        return `new MeleeAttackGoal(this, ${goal.config.speed || 1.0}, ${goal.config.mustSee !== false})`;
      case 'ranged_attack':
        return `new RangedAttackGoal(this, ${goal.config.speed || 1.0}, ${goal.config.attackInterval || 20}, ${goal.config.range || 10.0}F)`;
      case 'wander':
        return `new RandomStrollGoal(this, ${goal.config.speed || 1.0})`;
      case 'look_at_player':
        return `new LookAtPlayerGoal(this, Player.class, ${goal.config.range || 8.0}F)`;
      case 'swim':
        return `new FloatGoal(this)`;
      case 'panic':
        return `new PanicGoal(this, ${goal.config.speed || 1.25})`;
      case 'avoid_entity':
        return `new AvoidEntityGoal<>(this, ${goal.config.entityClass || 'Player.class'}, ${goal.config.distance || 6.0}F, ${goal.config.walkSpeed || 1.0}, ${goal.config.sprintSpeed || 1.2})`;
      case 'follow_player':
        return `new FollowMobGoal(this, ${goal.config.speed || 1.0}, ${goal.config.minDistance || 2.0}F, ${goal.config.maxDistance || 6.0}F)`;
      case 'tempt':
        return `new TemptGoal(this, ${goal.config.speed || 1.0}, Ingredient.of(Items.${goal.config.item || 'WHEAT'}), false)`;
      case 'leap_at_target':
        return `new LeapAtTargetGoal(this, ${goal.config.velocity || 0.4}F)`;
      default:
        return `new RandomStrollGoal(this, 1.0)`;
    }
  }

  private generateSoundMethods(mob: MobData): string {
    let code = '';

    if (mob.sounds.ambient) {
      code += `
    @Override
    protected SoundEvent getAmbientSound() {
        return SoundEvents.${this.toScreamingSnakeCase(mob.sounds.ambient)};
    }
`;
    }

    if (mob.sounds.hurt) {
      code += `
    @Override
    protected SoundEvent getHurtSound(DamageSource source) {
        return SoundEvents.${this.toScreamingSnakeCase(mob.sounds.hurt)};
    }
`;
    }

    if (mob.sounds.death) {
      code += `
    @Override
    protected SoundEvent getDeathSound() {
        return SoundEvents.${this.toScreamingSnakeCase(mob.sounds.death)};
    }
`;
    }

    return code;
  }

  private generateRendererClass(mob: MobData): string {
    const className = this.toPascalCase(mob.id);

    return `package com.${this.modId}.client.renderer;

import com.${this.modId}.entity.${className}Entity;
import com.${this.modId}.client.model.${className}Model;
import net.minecraft.client.renderer.entity.EntityRendererProvider;
import net.minecraft.client.renderer.entity.MobRenderer;
import net.minecraft.resources.ResourceLocation;

public class ${className}Renderer extends MobRenderer<${className}Entity, ${className}Model<${className}Entity>> {

    private static final ResourceLocation TEXTURE = new ResourceLocation("${this.modId}", "textures/entity/${mob.id}.png");

    public ${className}Renderer(EntityRendererProvider.Context context) {
        super(context, new ${className}Model<>(context.bakeLayer(${className}Model.LAYER_LOCATION)), ${mob.scale}F);
    }

    @Override
    public ResourceLocation getTextureLocation(${className}Entity entity) {
        return TEXTURE;
    }
}
`;
  }

  private generateModelClass(mob: MobData): string {
    const className = this.toPascalCase(mob.id);

    return `package com.${this.modId}.client.model;

import com.${this.modId}.entity.${className}Entity;
import com.mojang.blaze3d.vertex.PoseStack;
import com.mojang.blaze3d.vertex.VertexConsumer;
import net.minecraft.client.model.EntityModel;
import net.minecraft.client.model.geom.ModelLayerLocation;
import net.minecraft.client.model.geom.ModelPart;
import net.minecraft.client.model.geom.PartPose;
import net.minecraft.client.model.geom.builders.*;
import net.minecraft.resources.ResourceLocation;

public class ${className}Model<T extends ${className}Entity> extends EntityModel<T> {

    public static final ModelLayerLocation LAYER_LOCATION =
        new ModelLayerLocation(new ResourceLocation("${this.modId}", "${mob.id}"), "main");

    private final ModelPart body;
    private final ModelPart head;

    public ${className}Model(ModelPart root) {
        this.body = root.getChild("body");
        this.head = root.getChild("head");
    }

    public static LayerDefinition createBodyLayer() {
        MeshDefinition meshdefinition = new MeshDefinition();
        PartDefinition partdefinition = meshdefinition.getRoot();

        // Body
        partdefinition.addOrReplaceChild("body",
            CubeListBuilder.create()
                .texOffs(0, 16)
                .addBox(-4.0F, -8.0F, -4.0F, 8.0F, 12.0F, 8.0F),
            PartPose.offset(0.0F, 0.0F, 0.0F));

        // Head
        partdefinition.addOrReplaceChild("head",
            CubeListBuilder.create()
                .texOffs(0, 0)
                .addBox(-4.0F, -8.0F, -4.0F, 8.0F, 8.0F, 8.0F),
            PartPose.offset(0.0F, 0.0F, 0.0F));

        return LayerDefinition.create(meshdefinition, 64, 64);
    }

    @Override
    public void setupAnim(T entity, float limbSwing, float limbSwingAmount, float ageInTicks, float netHeadYaw, float headPitch) {
        // Animation logic here
        this.head.yRot = netHeadYaw * ((float)Math.PI / 180F);
        this.head.xRot = headPitch * ((float)Math.PI / 180F);
    }

    @Override
    public void renderToBuffer(PoseStack poseStack, VertexConsumer buffer, int packedLight, int packedOverlay, float red, float green, float blue, float alpha) {
        body.render(poseStack, buffer, packedLight, packedOverlay, red, green, blue, alpha);
        head.render(poseStack, buffer, packedLight, packedOverlay, red, green, blue, alpha);
    }
}
`;
  }

  private generateRegistration(mob: MobData): string {
    const className = this.toPascalCase(mob.id);

    return `// Add to your ModEntities.java or equivalent registration class

public static final RegistryObject<EntityType<${className}Entity>> ${this.toScreamingSnakeCase(mob.id)} = ENTITY_TYPES.register("${mob.id}",
    () -> EntityType.Builder.of(${className}Entity::new, ${this.getMobCategory(mob.behavior.type)})
        .sized(${mob.width}F, ${mob.height}F)
        .clientTrackingRange(${mob.followRange})
        .build(new ResourceLocation("${this.modId}", "${mob.id}").toString())
);

// In your client setup
event.registerLayerDefinition(${className}Model.LAYER_LOCATION, ${className}Model::createBodyLayer);
event.registerEntityRenderer(ModEntities.${this.toScreamingSnakeCase(mob.id)}.get(), ${className}Renderer::new);

// In your entity attribute registration
event.put(ModEntities.${this.toScreamingSnakeCase(mob.id)}.get(), ${className}Entity.createAttributes().build());
`;
  }

  private generateSpawnConfig(mob: MobData): string {
    const className = this.toPascalCase(mob.id);
    const conditions = mob.spawnConditions;

    return `// Add to your spawn configuration

// Register spawn placement
SpawnPlacements.register(
    ModEntities.${this.toScreamingSnakeCase(mob.id)}.get(),
    SpawnPlacements.Type.ON_GROUND,
    Heightmap.Types.MOTION_BLOCKING_NO_LEAVES,
    ${className}Entity::checkMobSpawnRules
);

// Biome spawn configuration
BiomeModifications.addSpawn(
    BiomeSelectors.includeByKey(
        ${conditions.biomes.map(b => `ResourceKey.create(Registries.BIOME, new ResourceLocation("minecraft", "${b}"))`).join(',\n        ')}
    ),
    ${this.getMobCategory(mob.behavior.type)},
    ModEntities.${this.toScreamingSnakeCase(mob.id)}.get(),
    ${conditions.spawnWeight}, // weight
    ${conditions.minGroupSize}, // min group size
    ${conditions.maxGroupSize}  // max group size
);
`;
  }

  private generateLootTable(mob: MobData): string {
    const drops = mob.drops.map(drop => this.generateLootEntry(drop)).join(',\n        ');

    return `{
  "type": "minecraft:entity",
  "pools": [
    {
      "rolls": 1,
      "entries": [
        ${drops}
      ]
    }
  ]
}`;
  }

  private generateLootEntry(drop: LootDrop): string {
    return `{
      "type": "minecraft:item",
      "name": "${drop.item}",
      "functions": [
        {
          "function": "minecraft:set_count",
          "count": {
            "min": ${drop.minCount},
            "max": ${drop.maxCount}
          }
        },
        {
          "function": "minecraft:looting_enchant",
          "count": {
            "min": 0,
            "max": ${drop.lootingMultiplier}
          }
        }
      ],
      "conditions": [
        {
          "condition": "minecraft:random_chance",
          "chance": ${drop.chance}
        }${drop.condition ? `,
        {
          "condition": "minecraft:${drop.condition.type}"
        }` : ''}
      ]
    }`;
  }

  private getBehaviorSuperclass(type: string): string {
    switch (type) {
      case 'hostile':
        return 'Monster';
      case 'neutral':
        return 'NeutralMob';
      case 'passive':
      default:
        return 'Animal';
    }
  }

  private getMobCategory(type: string): string {
    switch (type) {
      case 'hostile':
        return 'MobCategory.MONSTER';
      case 'passive':
        return 'MobCategory.CREATURE';
      case 'neutral':
      default:
        return 'MobCategory.AMBIENT';
    }
  }

  private toPascalCase(str: string): string {
    return str.split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join('');
  }

  private toScreamingSnakeCase(str: string): string {
    return str.toUpperCase().replace(/\s+/g, '_');
  }
}
