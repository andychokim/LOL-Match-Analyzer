import { getGroqChatCompletion } from '../../src/services/groqAnalysisService';
import { getPlayerSummary } from '../../src/services/playerSummaryService';
import Groq from 'groq-sdk';

// Mock dependencies
jest.mock('../../src/services/playerSummaryService');

// Mock groq-sdk
jest.mock('groq-sdk');

const mocks = {
    puuid: 'mockPUUID',
    matchid: 'mockMatchID',
    message: 'Analyze this player performance',
    playerSummary: {
        player_stats: {
            champion: 'Ahri',
            role: 'mid',
            champLevel: 16,
            kills: 5,
            deaths: 2,
            assists: 10,
            totalGold: 12000,
            totalDamage: 150000,
            visionScore: 25,
            wardsPlaced: 15,
            detectorWardsPlaced: 8,
            cs: 285,
            challenge: {
                teamDamagePercentage: 0.25,
                killParticipation: 0.75,
            },
            win: true,
        },
        player_timeline: [
            {
                timestamp: 0,
                events: [],
                participantFrames: {},
            },
        ],
    },
    groqResponse: {
        id: 'chatcmpl-mockId',
        object: 'chat.completion',
        created: 1672531200,
        model: 'llama-3.1-8b-instant',
        choices: [
            {
                index: 0,
                message: {
                    role: 'assistant',
                    content: 'The player had an excellent performance with high kill participation and efficient gold management.',
                },
                finish_reason: 'stop',
            },
        ],
        usage: {
            prompt_tokens: 100,
            completion_tokens: 50,
            total_tokens: 150,
        },
    },
};

describe('Groq Analysis Service', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        
        // Set up the default mock for Groq
        (Groq as unknown as jest.Mock).mockImplementation(() => ({
            chat: {
                completions: {
                    create: jest.fn(),
                },
            },
        }));
    });

    describe('getGroqChatCompletion', () => {
        it('should call getPlayerSummary with correct parameters', async () => {
            (getPlayerSummary as jest.Mock).mockResolvedValueOnce(mocks.playerSummary);
            
            const mockCreate = jest.fn().mockResolvedValueOnce(mocks.groqResponse);
            (Groq as unknown as jest.Mock).mockImplementation(() => ({
                chat: {
                    completions: {
                        create: mockCreate,
                    },
                },
            }));

            await getGroqChatCompletion(mocks.message, mocks.puuid, mocks.matchid);

            expect(getPlayerSummary).toHaveBeenCalledTimes(1);
            expect(getPlayerSummary).toHaveBeenCalledWith(mocks.puuid, mocks.matchid);
        });

        it('should return a valid chat completion response', async () => {
            (getPlayerSummary as jest.Mock).mockResolvedValueOnce(mocks.playerSummary);
            
            const mockCreate = jest.fn().mockResolvedValueOnce(mocks.groqResponse);
            (Groq as unknown as jest.Mock).mockImplementation(() => ({
                chat: {
                    completions: {
                        create: mockCreate,
                    },
                },
            }));

            const response = await getGroqChatCompletion(mocks.message, mocks.puuid, mocks.matchid);

            expect(response).toEqual(mocks.groqResponse);
            expect(response.choices).toBeDefined();
            expect(response.choices[0].message.content).toBe(
                'The player had an excellent performance with high kill participation and efficient gold management.'
            );
        });

        it('should include player summary in the message sent to Groq', async () => {
            (getPlayerSummary as jest.Mock).mockResolvedValueOnce(mocks.playerSummary);
            
            const mockCreate = jest.fn().mockResolvedValueOnce(mocks.groqResponse);
            (Groq as unknown as jest.Mock).mockImplementation(() => ({
                chat: {
                    completions: {
                        create: mockCreate,
                    },
                },
            }));

            await getGroqChatCompletion(mocks.message, mocks.puuid, mocks.matchid);

            // Verify that groq.chat.completions.create was called
            expect(mockCreate).toHaveBeenCalledTimes(1);
            
            // Verify the message includes both the input message and player summary
            const callArgs = mockCreate.mock.calls[0][0];
            expect(callArgs.messages[0].content).toContain(mocks.message);
            expect(callArgs.messages[0].content).toContain(JSON.stringify(mocks.playerSummary));
        });

        it('should handle undefined message parameter', async () => {
            (getPlayerSummary as jest.Mock).mockResolvedValueOnce(mocks.playerSummary);
            
            const mockCreate = jest.fn().mockResolvedValueOnce(mocks.groqResponse);
            (Groq as unknown as jest.Mock).mockImplementation(() => ({
                chat: {
                    completions: {
                        create: mockCreate,
                    },
                },
            }));

            await getGroqChatCompletion(undefined, mocks.puuid, mocks.matchid);

            expect(mockCreate).toHaveBeenCalledTimes(1);
            const callArgs = mockCreate.mock.calls[0][0];
            expect(callArgs.messages[0].content).toContain('undefined');
        });

        it('should throw error when getPlayerSummary fails', async () => {
            const error = new Error('Failed to fetch player summary');
            (getPlayerSummary as jest.Mock).mockRejectedValueOnce(error);

            await expect(
                getGroqChatCompletion(mocks.message, mocks.puuid, mocks.matchid)
            ).rejects.toThrow('Failed to fetch player summary');

            expect(getPlayerSummary).toHaveBeenCalledTimes(1);
        });

        it('should throw error when Groq API call fails', async () => {
            (getPlayerSummary as jest.Mock).mockResolvedValueOnce(mocks.playerSummary);
            
            const error = new Error('Groq API error');
            const mockCreate = jest.fn().mockRejectedValueOnce(error);
            (Groq as unknown as jest.Mock).mockImplementation(() => ({
                chat: {
                    completions: {
                        create: mockCreate,
                    },
                },
            }));

            await expect(
                getGroqChatCompletion(mocks.message, mocks.puuid, mocks.matchid)
            ).rejects.toThrow('Groq API error');
        });

        it('should use llama-3.1-8b-instant model', async () => {
            (getPlayerSummary as jest.Mock).mockResolvedValueOnce(mocks.playerSummary);
            
            const mockCreate = jest.fn().mockResolvedValueOnce(mocks.groqResponse);
            (Groq as unknown as jest.Mock).mockImplementation(() => ({
                chat: {
                    completions: {
                        create: mockCreate,
                    },
                },
            }));

            await getGroqChatCompletion(mocks.message, mocks.puuid, mocks.matchid);

            const callArgs = mockCreate.mock.calls[0][0];
            expect(callArgs.model).toBe('llama-3.1-8b-instant');
        });

        it('should send message with user role', async () => {
            (getPlayerSummary as jest.Mock).mockResolvedValueOnce(mocks.playerSummary);
            
            const mockCreate = jest.fn().mockResolvedValueOnce(mocks.groqResponse);
            (Groq as unknown as jest.Mock).mockImplementation(() => ({
                chat: {
                    completions: {
                        create: mockCreate,
                    },
                },
            }));

            await getGroqChatCompletion(mocks.message, mocks.puuid, mocks.matchid);

            const callArgs = mockCreate.mock.calls[0][0];
            expect(callArgs.messages[0].role).toBe('user');
        });
    });
});
