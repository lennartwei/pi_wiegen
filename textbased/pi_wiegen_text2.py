from config import GameConf as game_conf
from subfunctions import Game as game
import json
import time
import sys
import RPi.GPIO as GPIO
from hx711 import HX711
import numpy as np

game_conf = game_conf()
game = game()



def main():
    hx = HX711(5, 6)
    hx.set_reading_format("MSB", "MSB")
    referenceUnit = -320795.0 / 803.2
    hx.set_reference_unit(referenceUnit)
    hx.reset()
    hx.tare()
    ###################################################################################################################

    with open("/home/pi/pi_wiegen_by_bolt/textbased/player_data.json", "r") as json_file:
        player_data = json.load(json_file)
    game_score = {}
    players =[]
    while True:
        player = input(f'Player {len(players) + 1}: ').strip()
        if player != '': players.append(player)
        else: break
    for player in players:
        if player not in player_data:
            print(f'Added {player} to database')
            player_data[player] = {"tot_score": 0, "last_score": 0}
        game_score[player] = 0

    # Game Start
    for i in range(game_conf.settings["rounds_max"]):
        for player in players:
            won = False
            for retry in range(game_conf.settings["retry_max"]):
                weight_result = None
                weights = []
                tare = False
                drink = False
                start_time = time.time()
                print(player)
                round_score = {}
                dice_result = game.get_dice_result()
                print(f'Dice: {dice_result}')
                print('Place drink to tare')
                while weight_result is None:
                    try:
                        weight = hx.get_weight(1)
                        weights.append(weight)
                        sys.stdout.write(f"\r{weight:6.1f}g")
                        sys.stdout.flush()

                        if len(weights) > 3 and not tare and weight > 100 and round(weights[-1]) == round(weights[-2]):
                            input()
                            hx.tare()
                            print('\nTare finished. Drink now!')
                            tare = True
                        if tare and not drink and weights[-1] < -10 and round(weights[-1]) == round(weights[-2]):
                            drink = True
                            weight_bottle = weight
                            print('\ndrinking...')
                        if drink and tare and weights[-1] > weight_bottle + 5 and round(weights[-1], 1) == round(
                                weights[-2], 1):
                            weight_result = abs(weight)
                            # print(f'You drank {round(weight_result,1)}g')
                    except (KeyboardInterrupt, SystemExit):
                        GPIO.cleanup()
                        print("[INFO] 'KeyboardInterrupt Exception' detected. Cleaning and exiting...")
                        sys.exit()

                if abs(weight_result - dice_result) <= game_conf.settings["delta_max"]:
                    round_score[player] = game.get_score(diff="noob", dice_res=dice_result, weight_res=weight_result)
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
                if won: break
    # Save Scores
    for player in players:
        player_data[player]["last_score"] = game_score[player]
        player_data[player]["tot_score"] = game_score[player] + player_data[player]["tot_score"]

    with open(game_conf.path_player_data, "w") as json_file:
        json.dump(player_data, json_file)
    print(player_data)


if __name__ == "__main__":
    main()