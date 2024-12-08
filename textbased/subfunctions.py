import random
from config import GameConf as game_conf
import time

game_conf = game_conf()



class Game:
    def roll_dice(self):
        return random.randint(1,6)

    def get_weight_sim(self, dice):
        return dice + round(dice * random.uniform(-0.2,0.2))

    def get_dice_result(self):
        dice1 = self.roll_dice()
        dice2 = self.roll_dice()
        return int(f'{max(dice1, dice2)}{(min(dice1, dice2))}')

    def get_score(self,diff, dice_res, weight_res):
        if diff == "noob":
            score = round(10+0.1*dice_res*abs(1/(max((weight_res-dice_res),0.1))),0)
        return score

    def round_tare(self, weights, tare, hx, input_required=True):
        if len(weights) > 3 and not tare and weights[-1] > 100 and round(weights[-1]) == round(weights[-2]):
            hx.tare()
            time.sleep(0.2)
            print('\nTare finished. Drink now!')
            tare = True
        return tare
    
    def round_drink(self, weights, drink, tare, weight_bottle):
        if tare and not drink and weights[-1] < -10 and round(weights[-1]) == round(weights[-2]):
            drink = True
            #weight_bottle = weights[-1]
            print('\ndrinking...')
            weight_bottle = weights[-1]
        return drink, weight_bottle
    
    def round_weight_result(self, weights, weight_result, drink, tare,weight_bottle,input_required=True):
        if weight_bottle is not None:
            if drink and tare and weights[-1] > weight_bottle + 5 and round(weights[-1], 1) == round(
                    weights[-2], 1):
                weight_result = abs(weights[-1])
        return weight_result
    
    def round_update_score(self, won,weight_result, dice_result, player, retry, game_score, round_score):
        if abs(weight_result - dice_result) <= game_conf.settings["delta_max"]:
            round_score[player] = self.get_score(diff="noob", dice_res=dice_result, weight_res=weight_result)
            game_score[player] = game_score[player] + round_score[player]
            print(f'\nDice: {dice_result}g')
            print(f'\nDice: {weight_result}g')
            print(f"\nYou Win!  {round_score[player]}Points!!!!")
            won = True
        else:
            print(f'\nDice: {dice_result}g')
            print(f'\nWeight: {weight_result}g')
            print("You Lose!  Try Again!")
            round_score[player] = -5
            game_score[player] = game_score[player] + round_score[player]
            retry += 1
            if retry == game_conf.settings["retry_max"]:
                print(f"\nYou Lose {game_conf.settings['retry_max']}x")
        return won, round_score, game_score
    
    def round_save_score(self,players, player_data,game_score):
        for player in players:
            player_data[player]["last_score"] = game_score[player]
            player_data[player]["tot_score"] = game_score[player] + player_data[player]["tot_score"]
        return player_data