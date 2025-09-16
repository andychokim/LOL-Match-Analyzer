# Test suite for the player analysis functions.

import pytest
from unittest.mock import patch, Mock, ANY

from src.analysis.match_summary import get_matchStats, get_matchTimeData, get_playerSummary

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

        stats = get_matchStats(mock_puuid, mock_matchId)

        assert stats == response["stats"]

@pytest.mark.match_summary_timeData
class TestPlayerAnalysisTimeData:
    """
    Test suite for the get_matchTimeData function.
    """
    @patch("src.analysis.match_summary.get_matchTimeline")
    def test_get_matchTimeData(self, mock_matchTimeline):
        response = {
            "metadata": {
                "participants": [
                    "test-puuid",
                    "other-puuid"
                ]
            },
            "info": {
                "frames": [
                    {
                        "events": [
                            {
                                "participantId": 1, 
                                "type": "ITEM_PURCHASED"
                            },
                            {
                                "killerId": 1, 
                                "type": "CHAMPION_KILL"
                            },
                            {
                                "victimId": 2, 
                                "type": "CHAMPION_KILL"
                            },
                            {
                                "participantId": 2, 
                                "type": "WARD_PLACED"
                            }
                        ],
                        "participantFrames": {
                            "1": {"totalGold": 500},
                            "2": {"totalGold": 300}
                        }
                    }
                ]
            }
        }
        mock_matchTimeline.return_value = response

        data = get_matchTimeData(mock_puuid, mock_matchId)

        # Expected: Only events where participantId, killerId, or victimId == 1
        expected_data = {
            "frameData": [
                {
                    "events": [
                        {"participantId": 1, "type": "ITEM_PURCHASED"},
                        {"killerId": 1, "type": "CHAMPION_KILL"}
                    ],
                    "participantFrames": {"totalGold": 500}
                }
            ]
        }
        assert data == expected_data["frameData"]
    

@pytest.mark.match_summary_player
class TestPlayerAnalysisPerformance:
    """
    Test suite for the get_playerPerformance function.
    """
    @patch("src.analysis.match_summary.get_matchTimeData")
    @patch("src.analysis.match_summary.get_matchStats")
    def test_get_playerPerformance(self, mock_matchStats, mock_matchTimeData):

        stats_response = {"champion": "Ahri", "kills": 10}
        timeData_response = {
                "events": [
                    {"participantId": 1, "type": "CHAMPION_KILL"},
                    {"killerId": 1, "type": "CHAMPION_KILL"}
                ],
                "participantFrames": {"totalGold": 1500}
            }
            
        
        mock_matchStats.return_value = stats_response
        mock_matchTimeData.return_value = timeData_response

        summary = get_playerSummary(mock_puuid, mock_matchId, mock_matchId)

        assert summary == {
            "final_stats": stats_response,
            "timeline_data": timeData_response
        }
    