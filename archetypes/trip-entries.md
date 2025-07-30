---
date: '{{ time.Now.Format "2006-01-02" }}'
title: '{{ replace .File.ContentBaseName `-` ` ` | title }}'
summary: "<brief summary of this trip>"
header_image_path: "<url to image showing for this entry in the trip>"
trip:
  places:
    - id: <unique ID of a place visited on this day of the trip>
      lat: <latitude>
      lon: <longitude>
      desc: "<optional description of this place to show on the map>"
      image_url: "<url to the image to show for this place on the map>"
  places_visited:
    - <ID of a place listed in the parent trip>
---