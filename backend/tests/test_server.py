# Test suite for the FastAPI server endpoints.

import pytest
from unittest.mock import patch
from fastapi.testclient import TestClient

from src.riot_api.riot_client import RiotAPIError
from src.server import app

client = TestClient(app)

@pytest.mark.server_puuid
class TestServerPUUID:
    """
    This includes tests for fetching PUUID.
    """

    @patch("src.riot_api.riot_client.get_PUUID")
    def test_fetch_puuid_success(self, mock_get_PUUID):
        mock_puuid = "test-puuid-123"
        mock_get_PUUID.return_value = mock_puuid

        response = client.get("/puuid/testGameName/testTagLine")

        assert response.status_code == 200
        assert response.json() == {"puuid": mock_puuid}
        mock_get_PUUID.assert_called_once_with("testGameName", "testTagLine")
    
    @patch("src.riot_api.riot_client.get_PUUID")
    def test_fetch_puuid_failure_404(self, mock_get_PUUID):
        mock_get_PUUID.side_effect = RiotAPIError("PUUID fetch error - API failure")

        response = client.get("/puuid/testGameName/testTagLine")

        assert response.status_code == 404
        assert response.json() == {"detail": "PUUID fetch error - API failure"}
        mock_get_PUUID.assert_called_once_with("testGameName", "testTagLine")
    
    @patch("src.riot_api.riot_client.get_PUUID")
    def test_fetch_puuid_failure_500(self, mock_get_PUUID):
        mock_get_PUUID.side_effect = Exception("PUUID fetch error - unexpected")

        response = client.get("/puuid/testGameName/testTagLine")

        assert response.status_code == 500
        assert response.json() == {"detail": "Internal Server Error: PUUID fetch error - unexpected"}
        mock_get_PUUID.assert_called_once_with("testGameName", "testTagLine")

@pytest.mark.server_matches
class TestServerMatches:
    """
    This includes tests for fetching recent matches.
    """

    @patch("src.riot_api.riot_client.get_recentMatches")
    def test_fetch_recent_matches_success(self, mock_get_recentMatches):
        mock_matches = ["match1", "match2", "match3"]
        mock_get_recentMatches.return_value = mock_matches

        response = client.get("/recent-matches/test-puuid-123?count=3")

        assert response.status_code == 200
        assert response.json() == {"matches": mock_matches}
        mock_get_recentMatches.assert_called_once_with("test-puuid-123", 3)
    
    @patch("src.riot_api.riot_client.get_recentMatches")
    def test_fetch_recent_matches_failure_404(self, mock_get_recentMatches):
        mock_get_recentMatches.side_effect = RiotAPIError("Recent matches fetch error - API failure")

        response = client.get("/recent-matches/test-puuid-123?count=3")

        assert response.status_code == 404
        assert response.json() == {"detail": "Recent matches fetch error - API failure"}
        mock_get_recentMatches.assert_called_once_with("test-puuid-123", 3)

    @patch("src.riot_api.riot_client.get_recentMatches")
    def test_fetch_recent_matches_failure_500(self, mock_get_recentMatches):
        mock_get_recentMatches.side_effect = Exception("Recent matches fetch error - unexpected")

        response = client.get("/recent-matches/test-puuid-123?count=3")

        assert response.status_code == 500
        assert response.json() == {"detail": "Internal Server Error: Recent matches fetch error - unexpected"}
        mock_get_recentMatches.assert_called_once_with("test-puuid-123", 3)

@pytest.mark.server_details
class TestServerDetails:
    """
    This includes tests for fetching match details.
    """

    @patch("src.riot_api.riot_client.get_matchDetails")
    def test_fetch_match_details_success(self, mock_get_matchDetails):
        mock_details = {"match_id": "test-match-id", "info": "details"}
        mock_get_matchDetails.return_value = mock_details

        response = client.get("/match-details/test-match-id")

        assert response.status_code == 200
        assert response.json() == {"match_details": mock_details}
        mock_get_matchDetails.assert_called_once_with("test-match-id")
    
    @patch("src.riot_api.riot_client.get_matchDetails")
    def test_fetch_match_details_failure_404(self, mock_get_matchDetails):
        mock_get_matchDetails.side_effect = RiotAPIError("Match details fetch error - API failure")

        response = client.get("/match-details/test-match-id")

        assert response.status_code == 404
        assert response.json() == {"detail": "Match details fetch error - API failure"}
        mock_get_matchDetails.assert_called_once_with("test-match-id")

    @patch("src.riot_api.riot_client.get_matchDetails")
    def test_fetch_match_details_failure_500(self, mock_get_matchDetails):
        mock_get_matchDetails.side_effect = Exception("Match details fetch error - unexpected")

        response = client.get("/match-details/test-match-id")

        assert response.status_code == 500
        assert response.json() == {"detail": "Internal Server Error: Match details fetch error - unexpected"}
        mock_get_matchDetails.assert_called_once_with("test-match-id")

@pytest.mark.server_timeline
class TestServerTimeline:
    """
    This includes tests for fetching match timeline.
    """

    @patch("src.riot_api.riot_client.get_matchTimeline")
    def test_fetch_match_timeline_success(self, mock_get_matchTimeline):
        mock_details = {"match_id": "test-match-id", "info": "details"}
        mock_get_matchTimeline.return_value = mock_details

        response = client.get("/match-timeline/test-match-id")

        assert response.status_code == 200
        assert response.json() == {"match_timeline": mock_details}
        mock_get_matchTimeline.assert_called_once_with("test-match-id")
    
    @patch("src.riot_api.riot_client.get_matchTimeline")
    def test_fetch_match_timeline_failure_404(self, mock_get_matchTimeline):
        mock_get_matchTimeline.side_effect = RiotAPIError("Match timeline fetch error - API failure")

        response = client.get("/match-timeline/test-match-id")

        assert response.status_code == 404
        assert response.json() == {"detail": "Match timeline fetch error - API failure"}
        mock_get_matchTimeline.assert_called_once_with("test-match-id")

    @patch("src.riot_api.riot_client.get_matchTimeline")
    def test_fetch_match_timeline_failure_500(self, mock_get_matchTimeline):
        mock_get_matchTimeline.side_effect = Exception("Match timeline fetch error - unexpected")

        response = client.get("/match-timeline/test-match-id")

        assert response.status_code == 500
        assert response.json() == {"detail": "Internal Server Error: Match timeline fetch error - unexpected"}
        mock_get_matchTimeline.assert_called_once_with("test-match-id")

@pytest.mark.server_summary
class TestServerSummary:
    """
    This includes tests for fetching player summary.
    """

    @patch("src.analysis.match_summary.get_playerSummary")
    def test_fetch_player_summary_success(self, mock_get_playerSummary):
        mock_summary = {
            "player_stats": {"champion": "Ahri", "kills": 10, "deaths": 2, "assists": 5},
            "player_timeline": [{"events": [], "participantFrames": {}}, {"events": [], "participantFrames": {}}]
        }
        mock_get_playerSummary.return_value = mock_summary

        response = client.get("/player-summary/test-puuid-123/test-match-id")
        print(response.text)

        assert response.status_code == 200
        assert response.json() == {"player_summary": mock_summary}
        mock_get_playerSummary.assert_called_once_with("test-puuid-123", "test-match-id")

    @patch("src.analysis.match_summary.get_playerSummary")
    def test_fetch_player_summary_failure_500(self, mock_get_playerSummary):
        mock_get_playerSummary.side_effect = Exception("Player summary fetch error - unexpected")

        response = client.get("/player-summary/test-puuid-123/test-match-id")

        assert response.status_code == 500
        assert response.json() == {"detail": "Internal Server Error: Player summary fetch error - unexpected"}
        mock_get_playerSummary.assert_called_once_with("test-puuid-123", "test-match-id")
    