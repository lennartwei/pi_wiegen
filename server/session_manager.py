from typing import Dict, Optional
import time
from dataclasses import dataclass, asdict

@dataclass
class GameSettings:
    margin: int = 5
    maxRetries: int = 2
    players: list = None
    scoring: dict = None

    def __post_init__(self):
        if self.players is None:
            self.players = []
        if self.scoring is None:
            self.scoring = {
                'perfectScore': 1000,
                'marginPenalty': 100,
                'failurePenalty': 200,
                'minScore': -500
            }

@dataclass
class GameState:
    currentPlayerIndex: int = 0
    dice1: int = 0
    dice2: int = 0
    targetWeight: int = 0
    phase: str = 'setup'
    attempts: int = 0

@dataclass
class Session:
    id: str
    name: str
    owner: str
    created_at: float
    last_updated: float
    settings: GameSettings
    game_state: GameState

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'owner': self.owner,
            'created_at': self.created_at,
            'last_updated': self.last_updated,
            'settings': asdict(self.settings),
            'game_state': asdict(self.game_state)
        }

class SessionManager:
    def __init__(self):
        self._sessions: Dict[str, Session] = {}
        
    def create_session(self, session_data: dict) -> Session:
        """Create a new game session"""
        session = Session(
            id=session_data['id'],
            name=session_data['name'],
            owner=session_data['owner'],
            created_at=session_data['created_at'],
            last_updated=session_data['last_updated'],
            settings=GameSettings(**session_data['settings']),
            game_state=GameState(**session_data['game_state'])
        )
        self._sessions[session.id] = session
        return session
    
    def get_session(self, session_id: str) -> Optional[dict]:
        """Get session by ID"""
        session = self._sessions.get(session_id)
        return session.to_dict() if session else None
    
    def list_sessions(self) -> list:
        """List all active sessions"""
        # Clean up old sessions (older than 6 hours)
        current_time = time.time()
        self._sessions = {
            sid: session for sid, session in self._sessions.items()
            if current_time - session.created_at < 21600
        }
        return [session.to_dict() for session in self._sessions.values()]
    
    def update_session(self, session_id: str, session_data: dict) -> bool:
        """Update session settings or game state"""
        if session_id not in self._sessions:
            return False
            
        session = self._sessions[session_id]
        
        if 'settings' in session_data:
            session.settings = GameSettings(**session_data['settings'])
        if 'game_state' in session_data:
            session.game_state = GameState(**session_data['game_state'])
            
        session.last_updated = session_data.get('last_updated', time.time())
        return True
    
    def delete_session(self, session_id: str) -> bool:
        """Delete a session"""
        if session_id in self._sessions:
            del self._sessions[session_id]
            return True
        return False