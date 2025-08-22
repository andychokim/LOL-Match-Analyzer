# Test suite for the player analysis functions.

import pytest
from unittest.mock import patch, Mock, ANY

from src.analysis.player_analysis import get_matchStats, get_matchEvents, get_playerPerformance

mock_puuid = "test-puuid"
mock_matchId = "test-match-id"

@pytest.mark.player_analysis_stats
class TestPlayerAnalysisStats:
    """
    Test suite for the get_matchStats function.
    """
    @patch("src.analysis.player_analysis.get_matchDetails")
    def test_get_matchStats(self, mock_matchDetails):
        response = {"stats": "test-stats"}
        mock_matchDetails.return_value = response

        stats = get_matchStats(mock_puuid, mock_matchId)

        assert stats == response["stats"]

@pytest.mark.player_analysis_events
class TestPlayerAnalysisEvents:
    """
    Test suite for the get_matchEvents function.
    """
    
    

@pytest.mark.player_analysis_performance
class TestPlayerAnalysisPerformance:
    """
    Test suite for the get_playerPerformance function.
    """
    
    