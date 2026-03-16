from newspaper import Article
from ai_detector import detect_disaster

news_sources = [

"https://timesofindia.indiatimes.com",
"https://www.bbc.com/news"

]

def check_news():

    for url in news_sources:

        try:

            article = Article(url)
            article.download()
            article.parse()

            text = article.text

            disaster = detect_disaster(text)

            if disaster:
                print("Disaster detected:", disaster)

        except:
            pass