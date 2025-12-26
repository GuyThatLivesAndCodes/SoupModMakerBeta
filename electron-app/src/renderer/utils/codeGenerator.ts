/**
 * Simple code generation utilities for live preview
 */

import { MobData, EventData } from '@soupmodmaker/core';

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
