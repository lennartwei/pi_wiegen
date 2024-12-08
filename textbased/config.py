
class GameConf:
    def __init__(self):
        # self.path_player_data = "data/player_data.json"
        # self.path_dice= "data/dice_img/"
        self.path_player_data = "data/player_data.json"
        self.path_dice= "data/dice_img/"

        self.settings = {"delta_max":2,
                         "retry_max":3,
                         "rounds_max":10
                         }

        self.players = ["Lennart", "Lars", "Martin"]