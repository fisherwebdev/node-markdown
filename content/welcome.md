This site is about web application development and emerging interactive technologies, especially those that can be applied to the Web or be programmed with JavaScript.

You might find the following topics covered here: JavaScript, Ruby, CSS, HTML5, Node.js, jQuery, the Web Audio API, touch events and touch screen interactions, motion tracking, Leap Motion, Raspberry Pi, Arduino, Linux, OS X, MySQL, Postgres, Solr, CouchDB and a whole lot more.  Okay Googlebot?  Okay.

## Latest Blog Posts

### [Crafting Touch Interactions:] [2] Touch Events, Pointer Events and Hardware Acceleration

In the past, it might have been easy to ignore touch events. After all, mouse events were available in every browser, even on mobile devices. We could even tie our interactions to our old friend, the click event. So our websites and web applications worked on touchscreen devices, and we were happy. Oddly, however, as mobile usage of the Web began to rise, a closer inspection of touch interactions became more important. It turned out that using the click event was not such a good idea, as there is a noticeable delay between the moment a person's finger touches the screen and the actual triggering of the click event.

As recently as April of 2012, people were still [advocating the use of click] [1] on touchscreens. They may be still advocating it. But click is an inferior user experience &mdash; on Mobile Safari, the click event does not fire until around 380 milliseconds after the initial contact with the screen. Users want an immediate response to their actions, but how fast does the application really need to be? [Read more...] [2]

[1]: http://www.lukew.com/ff/entry.asp?1533
[2]: /2012/crafting-touch-interactions