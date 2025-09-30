# Test suite for the player analysis functions.

import pytest
from unittest.mock import patch, Mock, ANY

from src.analysis.player_summary import get_playerDetails, get_playerTimeline, get_playerSummary

mock_puuid = "test-puuid"
mock_matchId = "test-match-id"

@pytest.mark.player_details
class TestPlayerAnalysisStats:
    """
    Test suite for the get_matchStats function.
    """
    @patch("src.analysis.player_summary.get_matchDetails")
    def test_get_playerDetails(self, mock_matchDetails):
        response = {
            "info": {
                "participants": [
                    {
                        "puuid": "test-puuid",
                        "championName": "Ahri",
                        "teamPosition": "MID",
                        "champLevel": 15,
                        "kills": 10,
                        "deaths": 2,
                        "assists": 5,
                        "goldEarned": 12000,
                        "totalDamageDealtToChampions": 25000,
                        "visionScore": 30,
                        "wardsPlaced": 10,
                        "detectorWardsPlaced": 2,
                        "totalMinionsKilled": 200,
                        "neutralMinionsKilled": 30,
                        "perks": {"statPerks": {}, "styles": []},
                        "challenges": {"challenge1": 100, "challenge2": 200}
                    },
                    # should not be included
                    {
                        "puuid": "other-puuid",
                        "championName": "Yasuo",
                        "teamPosition": "MID",
                        "champLevel": 15,
                        "kills": 10,
                        "deaths": 2,
                        "assists": 5,
                        "goldEarned": 12000,
                        "totalDamageDealtToChampions": 25000,
                        "visionScore": 30,
                        "wardsPlaced": 10,
                        "detectorWardsPlaced": 2,
                        "totalMinionsKilled": 200,
                        "neutralMinionsKilled": 30,
                        "perks": {"statPerks": {}, "styles": []},
                        "challenges": {"challenge1": 100, "challenge2": 200}
                    },
                ]
            }
        }
        mock_matchDetails.return_value = response

        expected_stats = {
            "champion": "Ahri",
            "role": "MID",
            "champLevel": 15,
            "kills": 10,
            "deaths": 2,
            "assists": 5,
            "totalGold": 12000,
            "totalDamage": 25000,
            "visionScore": 30,
            "wardsPlaced": 10,
            "detectorWardsPlaced": 2,
            "cs": 230,  # 200 + 30
            "runes": {"statPerks": {}, "styles": []},
            "challenge": {"challenge1": 100, "challenge2": 200}
        }

        stats = get_playerDetails(mock_puuid, mock_matchId)

        assert stats == expected_stats

@pytest.mark.player_timeline
class TestPlayerAnalysisTimeData:
    """
    Test suite for the get_matchTimeData function.
    """
    @patch("src.analysis.player_summary.get_matchTimeline")
    def test_get_matchTimeline(self, mock_matchTimeline):
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

        data = get_playerTimeline(mock_puuid, mock_matchId)

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
    @patch("src.analysis.player_summary.get_playerTimeline")
    @patch("src.analysis.player_summary.get_playerDetails")
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

        summary = get_playerSummary(mock_puuid, mock_matchId)

        assert summary == {
            "player_stats": matchDetails_response,
            "player_timeline": matchTimeline_response
        }
    