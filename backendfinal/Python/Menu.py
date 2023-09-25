# -*- coding: utf-8 -*-

import pandas as pd
import numpy as np
import sys
import math
import random
import time
import json

import warnings
warnings.filterwarnings("ignore")
age = int(sys.argv[1])
height = float(sys.argv[2])
weight = float(sys.argv[3])
gender = sys.argv[4]
num_meals = int(sys.argv[5])
activity_level = (sys.argv[6])

# load the dataset
nutrients = pd.read_csv('C:/Users/hendc/OneDrive/Desktop/algo/nutrients_csvfile.csv')
nutrients=nutrients.replace("t",0)
nutrients=nutrients.replace("t'",0)

nutrients=nutrients.replace(",","", regex=True)
nutrients['Fiber']=nutrients['Fiber'].replace("a","", regex=True)
nutrients['Calories'][91]=(8+44)/2

nutrients['Grams']=pd.to_numeric(nutrients['Grams'])
nutrients['Calories']=pd.to_numeric(nutrients['Calories'])
nutrients['Protein']=pd.to_numeric(nutrients['Protein'])
nutrients['Fat']=pd.to_numeric(nutrients['Fat'])
nutrients['Sat.Fat']=pd.to_numeric(nutrients['Sat.Fat'])
nutrients['Fiber']=pd.to_numeric(nutrients['Fiber'])
nutrients['Carbs']=pd.to_numeric(nutrients['Carbs'])

nutrients=nutrients.dropna()

# define the functions for calculating BMI and calorie intake
def calculate_bmi(height, weight):
    return weight / ((height/100) ** 2)

# define the functions for calculating BMI and calorie intake
def calculate_calorie_intake(bmi,age,height,weight ,gender, activity_level):
    """
    Calculate the recommended daily calorie intake based on BMI, gender, and activity level.
age = int(input("Enter your age: "))
height = int(input("Enter your height (in centimeters): "))
weight = int(input("Enter your weight (in kilograms): "))
gender = input("Enter your gender (male/female): ")
activity_level = input("Enter your activity level (sedentary/lightly active/moderately active/very active): ")

    Args:
        bmi (float): The user's Body Mass Index (BMI).
        age (int): The user's age.
        height (float): The user's height in centimeters.
        weight (float): The user's weight in kilograms.
        gender (str): The user's gender. Either 'male' or 'female'.
        activity_level (str): The user's activity level. One of 'sedentary', 'lightly active', 'moderately active', or 'very active'.

    Returns:
        float: The recommended daily calorie intake in calories.

    """
    if gender == 'male':
        bmr = 88.36 + (13.4 * weight) + (4.8 * height) - (5.7 * age)
    else:
        bmr = 447.6 + (9.2 * weight) + (3.1 * height) - (4.3 * age)

    if activity_level == 'sedentary':
        factor = 1.2
    elif activity_level == 'lightly active':
        factor = 1.375
    elif activity_level == 'moderately active':
        factor = 1.55
    else:
        factor = 1.725

    # adjust calorie intake based on BMI
    if bmi < 18.5:
        calorie_intake = bmr * factor + 500
    elif bmi < 25:
        calorie_intake = bmr * factor
    else:
        calorie_intake = bmr * factor - 250

    return calorie_intake

# define the function for sports activity recommendation
def recommend_sports_activity(bmi):
    if bmi < 18.5:
        return 'You are underweight, try to focus on resistance training to gain muscle mass.'
    elif bmi >= 18.5 and bmi <= 24.9:
        return 'You are within the healthy weight range, try to focus on cardiovascular exercises to maintain your weight.'
    else:
        return 'You are overweight, try to focus on cardiovascular exercises to burn fat.'

def recommend_diet(calorie_intake, num_meals):
    """
    Recommends a diet based on the specified calorie intake and number of meals.
    Args:
    - calorie_intake (int): The desired calorie intake per meal.
    - num_meals (int): The desired number of meals in the diet.

    Returns:
    - diet (dict): A dictionary representing the recommended diet, where each key is a food category and each 
                  value is a list of tuples representing individual food items, where each tuple contains the 
                  food name, serving size, and total grams.
    """
    # shuffle the foods
    shuffled_foods = nutrients.sample(frac=1)

    # sort the shuffled foods in descending order of calories per gram
    sorted_foods = shuffled_foods.sort_values('Calories', ascending=False)

    # initialize the diet dictionary and total calorie count
    diet = {}
    total_calories = 0

    # calculate the starting index for the loop based on the current time
    start_index = int(time.time()) % len(sorted_foods)

    # loop through the sorted foods and add them to the diet until the calorie limit is reached
    for i in range(len(sorted_foods)):
        index = (start_index + i) % len(sorted_foods)
        row = sorted_foods.iloc[index]
        
        if total_calories >= calorie_intake * num_meals:
            break

        if row['Calories'] <= calorie_intake:
            if row['Category'] not in diet:
                diet[row['Category']] = []

            servings = int(math.floor(calorie_intake / row['Calories']))
            if servings > 0:
                diet[row['Category']].append((row['Food'], row['Measure'], servings * row['Grams']))
                total_calories += int(servings * row['Calories'])
      
    return diet

def generate_recommendation(age,height, weight, gender, num_meals, activity_level):
    """
    Generates a personalized recommendation for sports activity and diet based on the user's height, weight, gender,
    number of meals, and activity level. Calculates the user's BMI and recommended calorie intake using the 
    calculate_bmi and calculate_calorie_intake functions, recommends a sports activity using the recommend_sports_activity
    function, and recommends a diet using the recommend_diet function. Converts the NumPy data types to Python built-in
    types, constructs a JSON object with the recommendations, writes the object to a file, and returns the file path.
    :param age: the user's age
    :param height: the user's height in centimeters
    :param weight: the user's weight in kilograms
    :param gender: the user's gender ('male' or 'female')
    :param num_meals: the number of meals the user wants to eat per day
    :param activity_level: the user's activity level ('sedentary', 'lightly active', 'moderately active', or 'very active')
    :return: the file path where the JSON object with the recommendations is stored
    """
    bmi = calculate_bmi(height, weight)
    calorie_intake = calculate_calorie_intake(bmi,age,height,weight ,gender, activity_level)
    sports_activity = recommend_sports_activity(bmi)
    diet = recommend_diet(calorie_intake, num_meals)

    # Convert NumPy data types to Python built-in types
    for category, foods in diet.items():
        for i, food in enumerate(foods):
            food = list(food)
            food[2] = int(food[2])
            foods[i] = tuple(food)
        diet[category] = foods

    # Create the JSON object
    result = {
        'BMI': round(bmi, 2),
        'Calorie Intake': round(calorie_intake, 2),
        'Sports Activity': sports_activity,
        'Diet': diet
    }
    data = {
        "data":result
    }
    json_result = json.dumps(result)


    # Construct the file path
    file_path = f"{height}_{weight}_{gender}_{num_meals}_{activity_level}.json"

    # Write the JSON object to a file
    with open(file_path, 'w') as f:
        json.dump(result, f)
    print(json.dumps(result))

generate_recommendation(age=age,height=height, weight=weight, gender=gender, num_meals=num_meals, activity_level=activity_level)