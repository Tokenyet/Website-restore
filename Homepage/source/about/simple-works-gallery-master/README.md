simple-works-gallery
==================

* [Demo page 1](http://morris821028.github.io/simple-works-gallery/)
* [Demo page 2](http://morris821028.github.io/works/)

## Usage ##

### javascript ###

in header
```
<script src="http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js" type="text/javascript"></script>
<script src="js/script.js" type="text/javascript"></script> 
```

### css ###
```
<link rel="stylesheet" href="css/style.css">
```

### html ###
```
<body>
	...
      <script type="text/works-gallery">
{
  "content" : [

    { "title" : "School", 
      "works" : [
        {
          "title": "Chat Room Application",
          "cover": "http://i.imgur.com/oUO30I6.jpg",
          "description": "Simple Chat Room with online game<br/> Socket programming practice (Java)",
          "download": ["https://github.com/morris821028/hw-ChatRoom"],
          "demo": [],
          "video": ["https://www.youtube.com/watch?v=7ExCn1ipKeg"]
        },
        {
          "title": "Fuzzy System",
          "cover": "http://i.imgur.com/C44Hbrg.png",
          "description": "Car simulation implements PSO, GA, and fuzzy system (Java)",
          "download": ["https://github.com/morris821028/hw-FuzzySystem"],
          "demo": [],
          "video": ["https://www.youtube.com/watch?v=kt2mu679elU"]
        }
      ]
    },
    {
      "title" : "ACMer",
      "works" : [
          {
            "title": "UVa Online Judge",
            "cover": "http://i.imgur.com/y0Y2VRo.png",
            "description": "Solved 2800+ problems <br/> Username: morris821028",
            "link": ["http://uhunt.felix-halim.net/id/46705"],
            "download": ["https://github.com/morris821028/UVa"]
          }
      ]
    }
  ]
}
      </script>
     ...
</body>
```