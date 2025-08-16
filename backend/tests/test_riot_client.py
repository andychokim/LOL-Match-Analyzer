import pytest
from unittest.mock import patch, ANY
from src.riot_api.riot_client import get_PUUID, get_recentMatches, get_matchDetails


@pytest.mark.riot_client
class TestGetPUUID:
    """
    Test suite for the get_PUUID function.
    """
    def setup_method(self):
        self.gameName = "GNR nomsy"
        self.tagLine = "stuck"
        self.region = "americas"

    # Test for successful PUUID retrieval
    @patch("src.riot_api.riot_client.requests.get")
    def test_get_PUUID(self, mock_get):
        response = { "puuid": "1234-5678-8765-4321" }
        mock_get.return_value.status_code = 200
        mock_get.return_value.json.return_value = response

        puuid = get_PUUID(self.gameName, self.tagLine)

        assert puuid == response["puuid"] # Expected PUUID from mock response

        expected_url = f"https://{self.region}.api.riotgames.com/riot/account/v1/accounts/by-riot-id/{self.gameName}/{self.tagLine}"
        mock_get.assert_called_once_with(expected_url, headers={"X-Riot-Token": ANY})

    # Test for get_PUUID error handling 
    @patch("src.riot_api.riot_client.requests.get")
    @pytest.mark.parametrize("status_code, error_message", [
        (400, "Bad request"),
        (401, "Unauthorized"),
        (403, "Forbidden"),
        (404, "Data not found"),
        (405, "Method not allowed"),
        (415, "Unsupported media type"),
        (429, "Rate limit exceeded"),
        (500, "Internal server error"),
        (502, "Bad gateway"),
        (503, "Service unavailable"),
        (504, "Gateway timeout")
    ])
    def test_get_PUUID_error(self, mock_get, status_code, error_message):
        mock_get.return_value.status_code = status_code
        mock_get.return_value.text = error_message

        with pytest.raises(Exception) as exc_info:
            get_PUUID(self.gameName, self.tagLine)
        
        assert str(exc_info.value) == f"Error fetching PUUID: {status_code} - {error_message}"
        mock_get.assert_called_once()


@pytest.mark.riot_client
class TestGetRecentMatches:
    """
    Test suite for the get_recent_matches function.
    """
    def setup_method(self):
        self.puuid = "1234-5678-8765-4321"
        self.region = "americas"
        self.count = 3

    # Test for successful recent matches retrieval
    @patch("src.riot_api.riot_client.requests.get")
    def test_get_recentMatches(self, mock_get):
        response = ["matchID_1", "matchID_2", "matchID_3"]
        mock_get.return_value.status_code = 200
        mock_get.return_value.json.return_value = response

        matches = get_recentMatches(self.puuid, count=self.count)

        assert matches == response # Expected matches from mock response

        expected_url = f"https://{self.region}.api.riotgames.com/lol/match/v5/matches/by-puuid/{self.puuid}/ids?count={self.count}"
        mock_get.assert_called_once_with(expected_url, headers={"X-Riot-Token": ANY})

    # Test for get_PUUID error handling 
    @patch("src.riot_api.riot_client.requests.get")
    @pytest.mark.parametrize("status_code, error_message", [
        (400, "Bad request"),
        (401, "Unauthorized"),
        (403, "Forbidden"),
        (404, "Data not found"),
        (405, "Method not allowed"),
        (415, "Unsupported media type"),
        (429, "Rate limit exceeded"),
        (500, "Internal server error"),
        (502, "Bad gateway"),
        (503, "Service unavailable"),
        (504, "Gateway timeout")
    ])
    def test_get_recentMatches_error(self, mock_get, status_code, error_message):
        mock_get.return_value.status_code = status_code
        mock_get.return_value.text = error_message

        mock_PUUID = "1234-5678-8765-4321"
        with pytest.raises(Exception) as exc_info:
            get_recentMatches(mock_PUUID, count=3)
        
        assert str(exc_info.value) == f"Error fetching recent matches: {status_code} - {error_message}"
        mock_get.assert_called_once()


@pytest.mark.riot_client
class TestGetMatchDetails:
    """
    Test suite for the get_match_details function.
    """
    def setup_method(self):
        self.matchId = "matchID_1"

    # Test for successful match details retrieval
    @patch("src.riot_api.riot_client.requests.get")
    def test_get_matchDetails(self, mock_get):
        response = {
            "metadata": {"dataVersion": "1", "matchId": "matchID_1", "participants": []},
            "info": {"gameId": 123456789}
        }
        mock_get.return_value.status_code = 200
        mock_get.return_value.json.return_value = response

        match_details = get_matchDetails(self.matchId)

        assert match_details == response # Expected match details from mock response

        expected_url = f"https://americas.api.riotgames.com/lol/match/v5/matches/{self.matchId}"
        mock_get.assert_called_once_with(expected_url, headers={"X-Riot-Token": ANY})

    # Test for get_match_details error handling 
    @patch("src.riot_api.riot_client.requests.get")
    @pytest.mark.parametrize("status_code, error_message", [
        (400, "Bad request"),
        (401, "Unauthorized"),
        (403, "Forbidden"),
        (404, "Data not found"),
        (405, "Method not allowed"),
        (415, "Unsupported media type"),
        (429, "Rate limit exceeded"),
        (500, "Internal server error"),
        (502, "Bad gateway"),
        (503, "Service unavailable"),
        (504, "Gateway timeout")
    ])
    def test_get_matchDetails_error(self, mock_get, status_code, error_message):
        mock_get.return_value.status_code = status_code
        mock_get.return_value.text = error_message

        with pytest.raises(Exception) as exc_info:
            get_matchDetails(self.matchId)
        
        assert str(exc_info.value) == f"Error fetching match details: {status_code} - {error_message}"
        mock_get.assert_called_once()
