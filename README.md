
<img src ="public/logos/theta-logo.png" width = 100 height = 100>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;  <img src = "public/logos/theta-text-logo.png" width = 400 height = 100>
### Kingston's tools, now available to everyone.

### *Currently in development. Features may be bugged or not present while I work on porting everything from Kingston.*


### Tech Used:
    Next.JS
    Tailwind CSS

### If you'd like to play around with Theta while it's in development:

1. Run the Kingston backend API
    - git clone [Kingston](https://github.com/gholtzap/kingston-invest)
    - ``python api/run.py``
2. Run the Theta frontend
    - git clone Theta
    - ``npm run dev``
    - Navigate to [localhost:3000](https://localhost:3000)

# Features

1. ## α (Alpha) [Timing]
    - Enter the tickers you'd like to analyze
    - Click the arrow to submit
    - Program will output if this stock should be bought or not
        - Formula used: Kingston '2Q'
        - 'Buys' are green, the number next to it is how many $ it needs to decrease to no longer be a buy. (More positive = better)
        - 'No buys' are red. The number next to it is how many $ it is below the 'buy' threshold. (More negative = worse)
2. ## β (Beta) [Index Maker]
    - WIP :)