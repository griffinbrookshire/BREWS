from bs4 import BeautifulSoup
import requests
from pymongo import MongoClient

google = 'https://google.com/search?q='
search = 'breweries near me'
url = google + search

page = requests.get(url)
soup = BeautifulSoup(page.content, "html.parser")

print()
print()
for g in soup.find_all('div', class_ = 'g'):
  print('\n' + str(g) + '\n')
  for a in g.find_all('a', href=True):
    lower = str(a).lower()
    print(lower)
  # if 'brew' in lower or 'brewing' in lower or 'brewery' in lower:
  #   print("Found the URL:", a['href'])
