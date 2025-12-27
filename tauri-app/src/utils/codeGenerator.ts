/**
 * Simple code generation utilities for live preview
 */

import { MobData, EventData, ItemData } from '@soupmodmaker/core';

/**
 * Generate a simplified version of mob entity class for preview
 */
export function generateMobPreview(mob: MobData, modId: string = 'examplemod'): string {
  const className = mob.id.split('_').map(word =>
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join('') + 'Entity';

  return `package com.${modId}.entity;

import net.minecraft.world.entity.EntityType;
import net.minecraft.world.entity.Monster;
import net.minecraft.world.entity.ai.attributes.AttributeSupplier;
import net.minecraft.world.entity.ai.attributes.Attributes;
import net.minecraft.world.entity.ai.goal.*;
import net.minecraft.world.level.Level;

/**
 * ${mob.name}
 * ${mob.description || 'Custom mob entity'}
 */
public class ${className} extends Monster {

    public ${className}(EntityType<? extends Monster> type, Level level) {
        super(type, level);
    }

    @Override
    protected void registerGoals() {
        // AI Goals (Priority: lower = higher priority)
${mob.aiGoals.map(goal => `        this.goalSelector.addGoal(${goal.priority}, new ${getGoalClass(goal.type)}(this));`).join('\n')}
    }

    public static AttributeSupplier.Builder createAttributes() {
        return Monster.createMonsterAttributes()
            .add(Attributes.MAX_HEALTH, ${mob.health}.0D)
            .add(Attributes.MOVEMENT_SPEED, ${mob.speed}D)
            .add(Attributes.ATTACK_DAMAGE, ${mob.damage}.0D)
            .add(Attributes.ARMOR, ${mob.armor}.0D);
    }

    // Special Abilities
    @Override
    public boolean fireImmune() {
        return ${mob.immuneToFire};
    }

    @Override
    public boolean isPushable() {
        return ${mob.pushable};
    }
}`;
}

/**
 * Generate a simplified event handler preview
 */
export function generateEventPreview(event: EventData, modId: string = 'examplemod'): string {
  const className = event.id.split('_').map(word =>
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join('') + 'Handler';

  return `package com.${modId}.events;

import net.minecraftforge.event.${getEventImport(event.eventType)};
import net.minecraftforge.eventbus.api.SubscribeEvent;
import net.minecraftforge.fml.common.Mod;

/**
 * ${event.name}
 * ${event.description || 'Custom event handler'}
 */
@Mod.EventBusSubscriber(modid = "${modId}")
public class ${className} {

    @SubscribeEvent
    public static void on${event.eventType}(${getEventClass(event.eventType)} event) {
        // Conditions (${event.conditions.length} total)
${event.conditions.length > 0 ? generateConditionsPreview(event.conditions) : '        // No conditions'}

        // Actions (${event.actions.length} total)
${event.actions.length > 0 ? generateActionsPreview(event.actions) : '        // No actions'}
    }
}`;
}

function getGoalClass(goalType: string): string {
  const goalMap: Record<string, string> = {
    'melee_attack': 'MeleeAttackGoal',
    'ranged_attack': 'RangedAttackGoal',
    'wander': 'WaterAvoidingRandomStrollGoal',
    'look_at_player': 'LookAtPlayerGoal',
    'swim': 'FloatGoal',
    'panic': 'PanicGoal',
    'avoid_entity': 'AvoidEntityGoal',
    'follow_player': 'FollowOwnerGoal',
  };
  return goalMap[goalType] || 'RandomLookAroundGoal';
}

function getEventImport(eventType: string): string {
  const imports: Record<string, string> = {
    'player_join': 'entity.player.PlayerEvent.PlayerLoggedInEvent',
    'player_death': 'entity.living.LivingDeathEvent',
    'block_break': 'level.block.BlockEvent.BreakEvent',
    'entity_hurt': 'entity.living.LivingHurtEvent',
  };
  return imports[eventType] || 'Event';
}

function getEventClass(eventType: string): string {
  const classes: Record<string, string> = {
    'player_join': 'PlayerLoggedInEvent',
    'player_death': 'LivingDeathEvent',
    'block_break': 'BreakEvent',
    'entity_hurt': 'LivingHurtEvent',
  };
  return classes[eventType] || 'Event';
}

function generateConditionsPreview(conditions: any[]): string {
  return conditions.slice(0, 3).map(cond =>
    `        // Check: ${cond.type} (${JSON.stringify(cond.config)})`
  ).join('\n') + (conditions.length > 3 ? `\n        // ... and ${conditions.length - 3} more conditions` : '');
}

function generateActionsPreview(actions: any[]): string {
  return actions.slice(0, 3).map(action =>
    `        // Action: ${action.type} (${JSON.stringify(action.config)})`
  ).join('\n') + (actions.length > 3 ? `\n        // ... and ${actions.length - 3} more actions` : '');
}

/**
 * Generate a simplified item class for preview
 */
export function generateItemPreview(item: ItemData, modId: string = 'examplemod'): string {
  const className = item.id.split('_').map(word =>
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join('') + 'Item';

  // Basic item
  if (item.type === 'basic' || item.type === 'fuel') {
    return `package com.${modId}.item;

import net.minecraft.world.item.Item;
import net.minecraft.world.item.Rarity;

/**
 * ${item.name}
 * ${item.description || 'Custom item'}
 */
public class ${className} extends Item {

    public ${className}() {
        super(new Item.Properties()
            .stacksTo(${item.maxStackSize})
            .rarity(Rarity.${item.rarity.toUpperCase()})${item.fireproof ? '\n            .fireResistant()' : ''}
        );
    }
}`;
  }

  // Tool/Weapon
  if (item.type === 'tool' || item.type === 'weapon') {
    const toolProps = item.toolProperties!;
    const toolClass = item.type === 'weapon' ? 'SwordItem' : getToolClass(toolProps.type);

    return `package com.${modId}.item;

import net.minecraft.world.item.*;
import net.minecraft.world.item.crafting.Ingredient;
import net.minecraftforge.common.ForgeTier;

/**
 * ${item.name}
 * ${item.description || 'Custom tool'}
 */
public class ${className} extends ${toolClass} {

    public static final Tier TIER = new ForgeTier(
        ${toolProps.miningLevel}, // mining level
        ${toolProps.durability}, // durability
        ${toolProps.miningSpeed}f, // mining speed
        ${toolProps.attackDamage}f, // attack damage bonus
        ${toolProps.enchantability}, // enchantability
        null, // tag
        () -> Ingredient.EMPTY // repair material
    );

    public ${className}() {
        super(TIER, ${toolProps.attackDamage}, ${toolProps.attackSpeed}f,
            new Item.Properties()
                .rarity(Rarity.${item.rarity.toUpperCase()})${item.fireproof ? '\n                .fireResistant()' : ''}
        );
    }
}`;
  }

  // Armor
  if (item.type === 'armor') {
    const armorProps = item.armorProperties!;

    return `package com.${modId}.item;

import net.minecraft.world.item.*;
import net.minecraft.world.item.crafting.Ingredient;
import net.minecraft.sounds.SoundEvent;
import net.minecraft.sounds.SoundEvents;

/**
 * ${item.name}
 * ${item.description || 'Custom armor'}
 */
public class ${className} extends ArmorItem {

    public static final ArmorMaterial MATERIAL = new ArmorMaterial() {
        @Override
        public int getDurabilityForType(ArmorItem.Type type) {
            return ${armorProps.durability};
        }

        @Override
        public int getDefenseForType(ArmorItem.Type type) {
            return ${armorProps.defense};
        }

        @Override
        public int getEnchantmentValue() {
            return ${armorProps.enchantability};
        }

        @Override
        public SoundEvent getEquipSound() {
            return SoundEvents.ARMOR_EQUIP_GENERIC;
        }

        @Override
        public Ingredient getRepairIngredient() {
            return Ingredient.EMPTY;
        }

        @Override
        public String getName() {
            return "${modId}:${item.id}";
        }

        @Override
        public float getToughness() {
            return ${armorProps.toughness}f;
        }

        @Override
        public float getKnockbackResistance() {
            return ${armorProps.knockbackResistance}f;
        }
    };

    public ${className}() {
        super(MATERIAL, ArmorItem.Type.${armorProps.slot.toUpperCase()},
            new Item.Properties()
                .rarity(Rarity.${item.rarity.toUpperCase()})${item.fireproof ? '\n                .fireResistant()' : ''}
        );
    }
}`;
  }

  // Food
  if (item.type === 'food') {
    const foodProps = item.foodProperties!;

    return `package com.${modId}.item;

import net.minecraft.world.item.Item;
import net.minecraft.world.item.Rarity;
import net.minecraft.world.food.FoodProperties;

/**
 * ${item.name}
 * ${item.description || 'Custom food item'}
 */
public class ${className} extends Item {

    public static final FoodProperties FOOD = new FoodProperties.Builder()
        .nutrition(${foodProps.nutrition})
        .saturationMod(${foodProps.saturation}f)${foodProps.alwaysEdible ? '\n        .alwaysEat()' : ''}${foodProps.fastFood ? '\n        .fast()' : ''}${foodProps.isMeat ? '\n        .meat()' : ''}
        .build();

    public ${className}() {
        super(new Item.Properties()
            .stacksTo(${item.maxStackSize})
            .rarity(Rarity.${item.rarity.toUpperCase()})
            .food(FOOD)${item.fireproof ? '\n            .fireResistant()' : ''}
        );
    }
}`;
  }

  return '// Item type not supported yet';
}

function getToolClass(toolType: string): string {
  const classMap: Record<string, string> = {
    'pickaxe': 'PickaxeItem',
    'axe': 'AxeItem',
    'shovel': 'ShovelItem',
    'hoe': 'HoeItem',
    'sword': 'SwordItem',
    'custom': 'Item',
  };
  return classMap[toolType] || 'Item';
}

/**
 * Basic Java syntax highlighting
 */
export function highlightJava(code: string): string {
  if (!code) return '';

  let highlighted = code
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

  // Keywords
  const keywords = ['package', 'import', 'public', 'private', 'protected', 'static', 'final',
    'class', 'extends', 'implements', 'interface', 'void', 'return', 'new', 'this', 'super',
    'if', 'else', 'for', 'while', 'switch', 'case', 'break', 'continue', 'true', 'false', 'null'];

  keywords.forEach(keyword => {
    const regex = new RegExp(`\\b(${keyword})\\b`, 'g');
    highlighted = highlighted.replace(regex, '<span style="color: #569cd6">$1</span>');
  });

  // Strings
  highlighted = highlighted.replace(/"([^"]*)"/g, '<span style="color: #ce9178">"$1"</span>');

  // Comments
  highlighted = highlighted.replace(/\/\/(.*?)$/gm, '<span style="color: #6a9955">//$1</span>');
  highlighted = highlighted.replace(/\/\*([\s\S]*?)\*\//g, '<span style="color: #6a9955">/*$1*/</span>');

  // Annotations
  highlighted = highlighted.replace(/@(\w+)/g, '<span style="color: #4ec9b0">@$1</span>');

  // Numbers
  highlighted = highlighted.replace(/\b(\d+\.?\d*[DdFfLl]?)\b/g, '<span style="color: #b5cea8">$1</span>');

  return highlighted;
}
