## FCC Basejump: URL Shortener
#### User stories:

* I can pass a URL as a parameter and I will receive a shortened URL in the JSON response.
* When I visit that shortened URL, it will redirect me to my original link.
* If I pass an invalid URL that doesn't follow the valid http://www.example.com or www.example.com format, the JSON response will contain an error instead.

#### Example usage:
`https://edcheung-fcc-urlshortener.herokuapp.com/new/https://www.google.com`

#### Example output:
`{ original_url: "https://www.google.com", short_url: "https://edcheung-fcc-urlshortener.herokuapp.com/4" }`
