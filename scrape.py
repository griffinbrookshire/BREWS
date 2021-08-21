from bs4 import BeautifulSoup
import requests
from pymongo import MongoClient

def getCommonItems(a, b):
  a_set = set(a)
  b_set = set(b)
  # print(a_set)
  # print(b_set)
  return a_set.intersection(b_set)

try:
    client = MongoClient("mongodb+srv://admin:admin@cluster01.vh9wc.mongodb.net/griffinBrewsDB?retryWrites=true&w=majority")
    print("Connected successfully!!!")
except:  
    print("Could not connect to MongoDB")
    exit(1)

BEER_TYPES = {
  'ipa':
    ['hoppy', 'citrus', 'heavy', 'bitter', 'strong'],
  'stout':
    ['dark', 'sweet', 'strong'],
  'cider':
    ['sweet', 'light', 'smooth', 'fruity', 'weak'],
  'malt':
    ['dark', 'weak', 'smooth', 'nutty'],
  'lager':
    ['light', 'weak', 'smooth'],
  'sour':
    ['fruity', 'strong', 'tart', 'tangy', 'fruity'],
  'saison':
    ['fruity', 'spicy', 'strong', 'light', 'citrus']
}

url = 'https://www.trophybrewing.com/the-pizza'
page = requests.get(url)
soup = BeautifulSoup(page.content, "html.parser")
menu_items = soup.find('div', class_='menu-items').find_all('div', class_='menu-item')
for menu_item in menu_items:
  title = menu_item.find('div', class_='menu-item-title').text
  desc = menu_item.find('div', class_='menu-item-description').text
  title_match = list(getCommonItems(title.lower().split(), BEER_TYPES.keys()))
  desc_match = list(getCommonItems(desc.lower().split(), BEER_TYPES.keys()))
  if len(title_match) == 0 and len(desc_match) == 0:
    continue
  beer = {}
  if len(title_match) > 0:
    type = title_match[0]
  elif len(desc_match) > 0:
    type = desc_match[0]
  beer['name'] = title
  beer['type'] = type.capitalize()
  if type.upper() == 'IPA':
    beer['type'] = 'IPA'
  beer['description'] = desc
  beer['attributes'] = BEER_TYPES[type]
  # print()
  # print("Inserting match: ")
  # print(beer)
  # client.griffinBrewsDB.beers.insert_one(beer)

query = {'type': 'Ipa'}
new = {"$set": {'type': 'IPA'}}
# x = client.griffinBrewsDB.beers.update_many(query, new)
# print(x.modified_count)

print('\nListing db items:')

for item in client.griffinBrewsDB.beers.find():
  print(item)
  print()