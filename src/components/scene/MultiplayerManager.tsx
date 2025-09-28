"use client";

import { useState, useEffect, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { supabase } from '@/lib/supabaseClient';
import { type RealtimeChannel } from '@supabase/supabase-js';
import { type RapierRigidBody } from '@react-three/rapier';
import * as THREE from 'three';
import { type Character } from '../ui/MainMenu';
import { RemotePlayer } from './RemotePlayer';

type PlayerState = {
    userId: string;
    position: { x: number; y: number; z: number };
    rotationY: number;
    avatar_color: string;
    characterId: string;
    username?: string;
};

type PlayerPresenceState = {
    userId: string;
    avatar_color: string;
    characterId: string;
    username?: string; 
};

type MultiplayerManagerProps = {
    character: Character;
    playerRigidBodyRef: React.RefObject<RapierRigidBody | null>;
    playerGroupRef: React.RefObject<THREE.Group | null>;
    gameState: string;
};

const BROADCAST_INTERVAL = 100;

export const MultiplayerManager = ({ character, playerRigidBodyRef, playerGroupRef, gameState }: MultiplayerManagerProps) => {
    const [players, setPlayers] = useState<{ [id: string]: PlayerState }>({});
    const channelRef = useRef<RealtimeChannel | null>(null);
    const lastBroadcastTime = useRef(0);

    useEffect(() => {
        const channel = supabase.channel('game-room-v2', {
            config: {
                presence: {
                    key: character.id, 
                },
                broadcast: {
                    self: false, 
                },
            },
        });

        channel.on('presence', { event: 'leave' }, ({ leftPresences }) => {
            const leftCharacterIds = leftPresences.map(p => p.key);
            setPlayers(prev => {
                const newPlayers = { ...prev };
                leftCharacterIds.forEach(id => {
                    delete newPlayers[id];
                });
                return newPlayers;
            });
        });


        channel.on('presence', { event: 'sync' }, () => {
            const presenceState = channel.presenceState<PlayerPresenceState>();
            const newPlayers: { [id: string]: PlayerState } = {};

            for (const id in presenceState) {
                if (id !== character.id) {
                    const pres = presenceState[id][0];
                    newPlayers[id] = {
                        position: { x: 0, y: 10, z: 0 }, 
                        rotationY: 0,
                        userId: pres.userId,
                        avatar_color: pres.avatar_color,
                        characterId: pres.characterId,
                        username: pres.username,
                    };
                }
            }
            setPlayers(newPlayers);

        });


        channel.on('broadcast', { event: 'player-state' }, ({ payload }) => {
            setPlayers(prev => {
                if (prev[payload.characterId]) {
                    return {
                        ...prev,
                        [payload.characterId]: payload,
                    };
                }
                return prev;
            });
        });

        channel.subscribe(async (status) => {
            if (status === 'SUBSCRIBED') {
                await channel.track({
                    userId: character.user_id,
                    avatar_color: character.avatar_color,
                    characterId: character.id,
                    username: character.username,
                });
            }
        });

        channelRef.current = channel;

        return () => {
            if (channelRef.current) {
                channelRef.current.untrack();
                supabase.removeChannel(channelRef.current);
            }
        };
    }, [character.id, character.user_id, character.avatar_color, character.username]);

    
    useFrame((_, delta) => {
        lastBroadcastTime.current += delta * 1000;
        if (lastBroadcastTime.current < BROADCAST_INTERVAL) return;
        lastBroadcastTime.current = 0;

        const rigidBody = playerRigidBodyRef.current;
        const group = playerGroupRef.current;
        const channel = channelRef.current;

        if (rigidBody && group && channel && channel.state === 'joined') {
            const position = rigidBody.translation();
            const rotationY = group.rotation.y;
            const payload: PlayerState = {
                userId: character.user_id,
                characterId: character.id,
                position,
                rotationY,
                avatar_color: character.avatar_color,
                username: character.username,
            };
            channel.send({
                type: 'broadcast',
                event: 'player-state',
                payload,
            });
        }
    });

    return (
        <>
            {Object.values(players).map(player => (
                <RemotePlayer key={player.characterId} state={player} gameState={gameState} />
            ))}
        </>
    );  
};

