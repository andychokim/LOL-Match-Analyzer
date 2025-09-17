# Test suite for the player analysis functions.

import pytest
from unittest.mock import patch, Mock, ANY

from src.analysis.match_summary import get_playerMatchDetails, get_playerMatchTimeline, get_playerSummary

mock_puuid = "test-puuid"
mock_matchId = "test-match-id"

@pytest.mark.match_summary_stats
class TestPlayerAnalysisStats:
    """
    Test suite for the get_matchStats function.
    """
    @patch("src.analysis.match_summary.get_matchDetails")
    def test_get_matchStats(self, mock_matchDetails):
        response = {"stats": "test-stats"}
        mock_matchDetails.return_value = response

        stats = get_playerMatchDetails(mock_puuid, mock_matchId)

        assert stats == response["stats"]

@pytest.mark.match_summary_timeData
class TestPlayerAnalysisTimeData:
    """
    Test suite for the get_matchTimeData function.
    """
    @patch("src.analysis.match_summary.get_matchTimeline")
    def test_get_matchTimeData(self, mock_matchTimeline):
        response = {
            "info": {
                "frames": [
                    {
                        "events": [
                            {"killerId": 2, "type": "CHAMPION_KILL", "assistingParticipantIds": [1]},
                            {"killerId": 1, "type": "BUILDING_KILL"},
                            {"killerId": 1, "type": "TURRET_PLATE_DESTROYED"},
                            {"type": "DRAGON_SOUL_GIVEN", "teamId": 0},
                            {"type": "ELITE_MONSTER_KILL", "killerId": 2, "assistingParticipantIds": [3], "killerTeamId": 100},
                            {"type": "FEAT_UPDATE", "teamId": 100},
                            # Should NOT be included:
                            {"killerId": 2, "type": "TURRET_PLATE_DESTROYED"},
                            {"killerId": 2, "type": "BUILDING_KILL"},
                            {"killerId": 2, "type": "CHAMPION_KILL"},
                            {"type": "WARD_PLACED", "participantId": 1}
                        ],
                        "participantFrames": {
                            "1": {"totalGold": 500},
                            "2": {"totalGold": 300}
                        }
                    }
                ],
                "participants": [
                    {
                        "participantId": 1,
                        "puuid": "test-puuid"
                    },
                    {
                        "participantId": 2,
                        "puuid": "other-puuid"
                    }
                ]
            }
        }
        mock_matchTimeline.return_value = response

        data = get_playerMatchTimeline(mock_puuid, mock_matchId)

        # Expected: Only events with the conditions below:
        # type = CHAMPION_KILL and involves killerId, assistingParticipantIds or victimId of the player
        # type = ELITE_MONSTER_KILL (any) with DRAGON_SOUL_GIVEN (any)
        # type = FEAT_UPDATE (any)
        # type = BUILDING_KILL and involves killerId of the player
        # type = TURRET_PLATE_DESTROYED and involves killerId of the player
        expected_data = {
            "frameData": [
                {
                    "events": [
                        {"killerId": 2, "type": "CHAMPION_KILL", "assistingParticipantIds": [1]},
                        {"killerId": 1, "type": "BUILDING_KILL"},
                        {"killerId": 1, "type": "TURRET_PLATE_DESTROYED"},
                        {"type": "ELITE_MONSTER_KILL", "killerId": 2, "assistingParticipantIds": [3], "killerTeamId": 100},
                        {"type": "FEAT_UPDATE", "teamId": 100},
                    ],
                    "participantFrames": {"totalGold": 500}
                }
            ]
        }
        assert data == expected_data["frameData"]
    

@pytest.mark.player_summary
class TestPlayerAnalysisPerformance:
    """
    Test suite for the get_playerPerformance function.
    """
    @patch("src.analysis.match_summary.get_playerMatchTimeline")
    @patch("src.analysis.match_summary.get_playerMatchDetails")
    def test_get_playerPerformance(self, mock_matchStats, mock_matchTimeData):

        matchDetails_response = {"champion": "Ahri", "kills": 10}
        matchTimeline_response = {
                "events": [
                    {"participantId": 1, "type": "CHAMPION_KILL"},
                    {"killerId": 1, "type": "CHAMPION_KILL"}
                ],
                "participantFrames": {"totalGold": 1500}
            }
            
        
        mock_matchStats.return_value = matchDetails_response
        mock_matchTimeData.return_value = matchTimeline_response

        summary = get_playerSummary(mock_puuid, mock_matchId, mock_matchId)

        assert summary == {
            "player_stats": matchDetails_response,
            "player_timeline": matchTimeline_response
        }
    