Crafting Touch Interactions: Touch Events, Pointer Events and Hardware Acceleration
===================================================================================

by Bill Fisher<br /> 
Originally published by [Hot Labs] [26] on 10/26/2012, 10:37 am

[26]: http://labs.hotstudio.com

In the past, it might have been easy to ignore touch events. After all, mouse events were available in every browser, even on mobile devices. We could even tie our interactions to our old friend, the click event. So our websites and web applications worked on touchscreen devices, and we were happy. Oddly, however, as mobile usage of the Web began to rise, a closer inspection of touch interactions became more important. It turned out that using the click event was not such a good idea, as there is a noticeable delay between the moment a person's finger touches the screen and the actual triggering of the click event.

As recently as April of 2012, people were still [advocating the use of click] [1] on touchscreens. They may be still advocating it. But click is an inferior user experience &mdash; on Mobile Safari, the click event does not fire until around 380 milliseconds after the initial contact with the screen. Users want an immediate response to their actions, but how fast does the application really need to be?

[1]: http://www.lukew.com/ff/entry.asp?1533

In professional audio and in audio software design, it is well known that latencies of only 10 milliseconds can become distracting, and [most people will begin to perceive an echo] [2] in audio at about 20 milliseconds. In video production, the standard frame rate is 30 frames/second, or every 34 milliseconds. The refresh rate of a touchscreen is usually twice as fast as video, or every 17 milliseconds.

[2]: https://forum.ableton.com/viewtopic.php?t=46567

In 1993, [Jakob Nielsen cited research] [3] from 1968 showing the threshold at which the user will feel that the application is responding instantaneously is approximately 0.1 seconds (100 milliseconds). Nielsen goes on to say, "1.0 second is about the limit for the user's flow of thought to stay uninterrupted, even though the user will notice the delay. Normally, no special feedback is necessary during delays of more than 0.1 but less than 1.0 second, but the user does lose the feeling of operating directly on the data." So that 380-millisecond delay in Mobile Safari is clearly in an undesirable range. And it's not just Mobile Safari &mdash; many of the other browsers behave similarly.

[3]: http://www.useit.com/papers/responsetime.html

This delay arises due to the presence of the double-click event that is usually used to zoom in or out the browser's field of view. The double-click event requires that the browser wait to see whether a second contact with the screen will happen. This window of opportunity for the second contact creates a poor user experience for the first contact. In some of the other browsers, the use of the device-width meta tag will alter this behavior to bring the firing of the click event much closer to touchstart. Unfortunately, this behavior is not yet widespread.

What can be done?  Enter touch events: touchstart, touchmove, touchend and touchcancel.  These events fire immediately, and they are available on all of the current mobile browsers except Internet Explorer.

Touch events were first implemented in WebKit browsers &mdash; Mobile Safari, the Android Browser, and now Chrome for Android or iOS. The WebKit touch events were eventually turned into a W3C proposal in 2011, and now both Firefox for Android and Opera's mobile browsers also implement them. The last holdout on touch events is our beloved IE (I will cover how IE is handling touch later in this article.) While the first version of the Touch Event specification is already a W3C [recommendation] [4], the second version is currently a [working draft] [5]. Firefox on Android implements this second version the most. But the WebKit team already has [much of their implementation done] [6], so we can guess that v.2 will arrive in Chrome quite soon.

[4]: http://www.w3.org/TR/2011/CR-touch-events-20111215/
[5]: http://www.w3.org/TR/2011/WD-touch-events-20110505/
[6]: http://trac.webkit.org/browser/trunk/Source/WebCore/dom/Touch.idl


Mobile Safari goes a step further than touch events, also offering the developer [gesture events] [7]: gesturestart, gesturechange and gestureend. These are higher-level abstractions for the pinch and rotate multi-touch gestures. Other than the inclusion of the scale and rotation data of the gesture, they are in many ways quite similar. Because they are specific to Mobile Safari, and because the scale and rotation data can be fairly easily calculated on the fly, I tend to avoid these events.

[7]: http://developer.apple.com/library/ios/#documentation/AppleApplications/Reference/SafariWebContent/HandlingEvents/HandlingEvents.html#//apple_ref/doc/uid/TP40006511-SW23

Gestures are, however, what we are really after. We want to not only detect a pinch or a rotation, but perhaps more significantly a drag, a swipe, a long press, and perhaps others. It can be difficult to differentiate these gestures, to determine the user's intention, based on the quite limited data available in the touch events, but it's not impossible. It does require calculations, often based on trigonometry or physics, and unfortunately I can never remember the math.  Instead of trying to remember and repeatedly implement those formulas, I prefer to lean on libraries to do the heavy lifting for me.

Touch Libraries
---------------

There are many excellent [libraries for touch] [8], but back in the summer of 2011, none of the available libraries did quite what I needed. So I wrote [Touchy] [9], a jQuery plugin for managing touch events. At the time, I was working on a project where drag, swipe, pinch and tap were all trying to get along in the same environment. When the project was over, I pulled the code out, rearchitected it with great [influence from Ben "Cowboy" Alman] [10], and included some other significant gestures like rotate and long press. Hot Studio released it [on GitHub] [11] as Touchy.

[8]: https://github.com/bebraw/jswiki/wiki/Touch
[9]: http://touchyjs.org/
[10]: http://benalman.com/news/2010/03/jquery-special-events/
[11]: https://github.com/HotStudio/touchy


[Hammer.js] [12] is another touch library that comes either as standalone, vanilla JavaScript or as a jQuery plugin. It's very well written and the source code is easy to read and understand. It's quite similar to Touchy, as both libraries help the developer to detect gestures and return pre-calculated event data to assist the developer's task in constructing event handlers. Hammer.js implements tap, double-tap, swipe, drag, long press (called "hold"), and a combined pinch and rotation called "transform."

[12]: https://github.com/EightMedia/hammer.js

Like Touchy, Hammer.js also exposes many configuration variables to help the library adapt to many different problems &mdash; and Hammer will probably suit the vast majority of needs. One caveat, however, is that Hammer's private _has_touch() method, which attempts to detect the presence of touch events in the browser, is not quite as robust as the tests in [Modernizr] [13]. If you use Hammer.js, you may want to edit the code to ensure that touch detection is occurring in the most comprehensive manner. Also, if you want to do something outside of Hammer's assumptions, you're probably out of luck. Touchy supports doing things like [rotating a wheel with a single finger] [14], and Hammer demands that all rotations must use two fingers.

[13]: http://modernizr.com/
[14]: http://hotstudio.github.com/touchy/examples/wheel-inertia.html

Setting Up a Touchable Page
---------------------------

There are a number of meta tags and CSS tricks that will help you to gain more control of the touch environment. The first of these was mentioned above: the device-width meta tag:

<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0">
This tag will prevent the browser from taking the page as it renders on large screen, and shrinking it down to the size of the small screen. Double tap and pinch will no longer perform zooming on the page.

Having set the viewport up properly, now you may want to prevent scrolling entirely, and take deeper control of the page. This is only a good idea if you are developing an application that fits within the frame of the screen, and this this is probably only going to happen in the context of something larger than a phone. To prevent the page from jiggling around when the user swipes or drags, we have to call preventDefault() on any touchmove event that bubbles up to the window. Of course, we could call preventDefault only on a container if we are only concerned with touch activity inside that container. But to lock down the entire page, we can use the following lines of JavaScript:

```javascript
window.addEventListener("touchmove", function(e){
  e.preventDefault();
});
```

In Internet Explorer 10, instead of using JavaScript, we can declaratively prevent scrolling behavior on either a specific element or the enitre HTML document with the following bit of CSS:

```css
html {
  -ms-touch-action: none; /* no scroll/zoom. handle touch with JS */
}
```

Additionally, the following CSS properties will help to prevent some unwanted behaviors of browsers that are doing their best to present a Web made for desktop to mobile devices. I'm showing the WebKit prefix here, as these are far from standard, but Mozilla has implemented some of these too.  Hammer.js will apply these if you set that library's css_hacks property to be true.

*Please note: For simplicity's sake, I am only showing the WebKit version of this, but you should definitely use the other vendor prefixes for the other browsers.*

```css
html {
  /* Prevents the selection of text within an element.  
    This can be useful in relation to a long press or other long touch interaction.*/
  -webkit-user-select: none;

  /* Prevents the normal bubble dialog box for links. */
  -webkit-touch-callout: none;

  /* Prevents the contents of an element (such as an image) from being dragged separately from the element. */
  -webkit-user-drag: none;

  /* Sets the color and opacity of the highlight color when a user taps a link or clickable element.
    Set this to an opacity of zero to eliminate the highlight entirely. */
  -webkit-tap-highlight-color: rgba(0,0,0,0);
}
```

Hardware Acceleration and requestAnimationFrame
-----------------------------------------------

To make our touch interactions as fluid and seamless as possible, we want to offload any animations to the GPU (graphics processing unit) to allow the CPU the freedom to do other things, like computations. Getting animations to be handled by the GPU is commonly called hardware acceleration. We are using a new part of the hardware to accelerate our graphics rendering.

Only a few aspects of web browsers are currently hardware accelerated. We are seeing more browsers provide support for a hardware accelerated canvas and for WebGL, but CSS3 transforms and transitions are perhaps more useful and enjoy more cross-browser support. Through a few hacks, we can make sure even the simplest CSS3 animations receive the royal GPU treatment.

Instead of animating the DOM positioning of an element with JavaScript, we are going to simply animate the painting of the element on the screen. Its DOM positioning won't change, but how it renders on the screen will change. Let's start with a simple CSS3 transform.

```css
.new_location {
  -webkit-tranform: translate(200px, 0);
}
```

This transform does shift the element 200 pixels to the right, but it is not hardware accelerated. We can force that pretty easily, however, with a hack. Even though we only want to move the element along the horizontal axis, we will use translate3d instead of translate. Let's try it:

```css
.new_location {
  -webkit-tranform: translate3d(200px, 0, 0);
}
```

Or even more simply:

```css
.new_location {
  -webkit-tranform: translateX(200px);
}
```

This starts to make a big difference when we attempt to create animations with CSS properties that are dynamically set by JavaScript.  Consider this rotation animation:

```javascript
var elem = document.querySelector("#my_element"),
    degrees = 0,
    spin = function () {
      degrees = degrees == 350 ? 0 : degrees + 10; // reset to zero at the end of the cycle
      elem.style.webkitTransform = "rotate(" + degrees + "deg)";
      requestAnimationFrame(spin, 1000/60); // 60 frames per second is the screen's refresh rate
    }(); // invoke the spinning function immediately
```    
    
This animation may look okay on a desktop browser, but when we try look at that same animation on an Android device there will be a noticeable degradation. We can improve this by either using rotate3d, or by simply adding a 3D translation to the transformation declaration.

```javascript
elem.style.webkitTransform = "rotate3d(0,0,0" + degrees + "deg)";
```

or:

```javascript
elem.style.webkitTransform = "rotate(" + degrees + "deg) translateZ(0)";
```

Animations that can simply run on their own without needing to update themselves based on user interaction can be animated with a CSS3 transition. All CSS3 transitions are hardware accelerated in WebKit browsers, so no 3D transformation is required.

Sometimes, we don't have a phone in front of us to test on, and we want to make sure we are getting the hardware acceleration we are looking for. Luckily, we can start Chrome, Safari or the iPhone Simulator, which comes bundled with Xcode, with some flags that will highlight the elements that are hardware accelerated.

On Chrome, we can see a frame rate indicator when anything on the page is getting processed by the GPU, and we can also see borders around our accelerated elements. To do this, open a tab and go to chrome://flags. There you can find and enable the settings called, "" and "".

With Safari and the iPhone Simulator, we need to start them up from Terminal. After opening Terminal, we type this into the command line:

```bash
CA_COLOR_OPAQUE=1 /Applications/Safari.app/Contents/MacOS/Safari
```

or:

```bash
CA_COLOR_OPAQUE=1 /Developer/Platforms/iPhoneSimulator.platform/Developer/Applications/iPhone\ Simulator.app/Contents/MacOS/iPhone\ Simulator
```

Please note: the file path to your applications may not be the same as mine, so you may need to adjust it.

Internet Explorer and Pointer Events
------------------------------------

Thus far, we've not paid much attention to the elephant in the room: mouse events. We're not developing just for mobile. Ideally, with a responsive web design in place, our web pages and applications will be viewable on any platform. So we need to figure out what to do about mouse events.

As I stated earlier, one strategy from the past was to simply ignore the touch vs. mouse problem and just bind everything to the click event. But that won't work very well due to the delay in the interaction that often comes along with it. Another solution I've employed was to first determine whether the user has a touch-enabled browser, and then dynamically attach event listeners for either mouse or touch events. But the world is a wonderful place that keeps inventing new ways to destroy Web developers' best laid plans. Now, instead of having separate worlds for touch and mouse events, we have touch-enabled laptops, so mouse and touch need to live together in perfect harmony.

In the short term, one solution might be to bind events to both mouse and touch events, and to simply call preventDefault() on the event object within the event handler. This will prevent the mouse events from firing after the touch events. But if a mouse event occurs, it will still get caught and handled directly by the mouse event listeners we have in place.

But we can easily imagine situations where this solution falls short, such as a long or dynamic set of items that would be better handled by an event delegation pattern. Luckily, Microsoft has submitted a new [proposal to the W3C] [15] to make the [pointer events in IE10] [16] into a web standard. Pointer events are quite similar to mouse and touch events, attempting to bring them together into a unified model, but they also differ from them in a few very important ways.

[15]: http://www.w3.org/Submission/pointer-events/
[16]: http://msdn.microsoft.com/en-us/library/ie/hh772103.aspx

Pointer events are ostensibly designed with three modes of interaction in mind: the mouse, the touchscreen, and the stylus. This last addition is perhaps not quite as odd it might appear. In the context of pointer events, styli are more interesting than they have been in the past. The pointer events specification includes a pressure attribute, similar to the new force attribute in touch v.2. But pressure from a stylus would be easily achieved with current technology, and could be continually changing to allow for modulations in a drawn line. This would be a much more artistic and expressive way of interacting with a web interface than anything we have seen in the past. The pointer events inclusion of tiltX and tiltY attributes supports this idea as well. Further, styli are highly tactile, direct interfaces much like touch, but they are more precise and can include buttons to allow further expression of the user's intent. The pointer events specification has good support for button interactions, offering a model that can accommodate up to five buttons.

Because the PointerEvent object is child of the UIEvent object, much like the TouchEvent and MouseEvent objects, it inherits many of the same attributes that we have grown accustomed to, such as pageX and pageY &mdash; the page coordinate where the user is interacting with the content.

Interestingly, however, the pointer events are only very loosely associated with each other. The specification seems incomplete without the *other* part of Microsoft's new event model, which is confusingly named gesture events (yes, just like Apple's, which are only somewhat related).
[MSGestureEvents] [17] not only provide the ability to detect standard gestures such as pinch-to-transform, double-tap and long press, they are also closely related to [MSGesture] [18] objects, which may serve to arbitrarily group together pointer events into multi-touch gestures. Additionally, Microsoft throws in some extra magic with inertia to sweeten the sauce.

[17]: http://msdn.microsoft.com/en-us/library/ie/hh772076.aspx
[18]: http://msdn.microsoft.com/en-us/library/ie/hh968249.aspx 

But while these new gesture events are exciting, in some ways they are quite laborious to work with and limited in their scope. Consider the boilerplate to get started with a custom gesture event:

CSS:

```css
body {
  -ms-touch-action: none; /* prevent default gestures */
  -ms-user-select: none;  /* prevent text selection */
}
```

JavaScript Feature Detection (after detecting touch events are not available):

```javascript
if (window.navigator.msPointerEnabled) {
  // The rest of the JS would live inside here.
}
else {
  // use mouse events
}
```

JavaScript Pointer Event Handlers:

```javascript
var customGesture = new MSGesture();
var elem = document.getElementById("html5");

// assign the element to the gesture object
customGesture.target = elem;

elem.addEventListener("MSPointerDown", function (ev) {
  // each pointer must be added to the gesture
  customGesture.addPointer(ev.pointerId);
});
Yeah, can you believe it? Not so nice. But wait…there are some more interesting things to come. Now we can finally set up our gesture's event handler.

elem.addEventListener("MSGestureChange", function (ev) {
  // get the current css transform matrix
  var matrix = new MSCSSMatrix(ev.target.style.transform);

  // apply a new matrix built from the old
  ev.target.style.transform = matrix
    .rotate(ev.rotation * 180 / Math.PI)
    .scale(ev.scale)
    .translate(ev.translationX, ev.translationY);
});
```

Now we have something that is really quite awesome. Please [check out the demo] [19] if you have IE10, or [watch the video] [20] if you don't.

[19]: http://bill.hotstudiodev.com/demo/ms/cust-gest.html
[20]: http://vimeo.com/hotstudio/ie10-gestures

<iframe src="http://player.vimeo.com/video/52197745?badge=0" width="400" height="300" frameborder="0" webkitAllowFullScreen mozallowfullscreen allowFullScreen></iframe>

[Example of Custom Gestures in IE10] [21] from [Hot Studio] [22] on [Vimeo] [23].

[21]: http://vimeo.com/52197745
[22]: http://vimeo.com/hotstudio
[23]: http://vimeo.com/

Not only do we have complete control over the transform of the element, but we also have a default inertia physics engine thrown in to boot! If we don't want that inertia, we can do this at the top of our gesture event handler:

```javascript
if (e.detail == e.MSGESTURE_FLAG_INERTIA) return;
```

The downside of all this is that, as far as I can tell, Microsoft has decided that we will always want to work with two fingers for these interactions. Also, the data in the gesture event object is tied to matrix transformations, and as Barbie and I both like to say, math is hard. Especially matrix math. While matrix transformations are really efficient and wonderful, they aren't super friendly toward the design-minded web developer. It would have been nice if we could have opted-in.

Haptic Feedback
---------------

The [vibration API] [24] exists currently as a W3C Candidate Recommendation, but I still hear people say (usually with an insinuating wink) that they don't understand the use case. Let me make the purpose of the vibration API plain: haptic feedback.

[24]: http://www.w3.org/TR/vibration/

The word haptic comes from the Greek haptikos, meaning "pertaining to the sense of touch." Haptics are a type of user feedback that can involve not only vibrations, but also forces, motions or electrical charges. Essentially, haptic feedback happens when a user touches a device, and the device touches the user in return. A little jolt of vibration helps the device tell the user, "I heard you. You pressed a button, and I registered that." Currently, the vibration API is only available in Firefox for Android, but support has already been checked into the trunk of WebKit, so support in Chrome for Android can't be far behind. Here is an example of using the vibration API for haptic feedback alongside some additional code you might normally use for visual feedback.

```javascript
var elem = document.querySelector("div");
elem.addEventListener("touchstart", function () {
  elem.style.background = "#f00";
  if ("vibrate" in navigator) navigator.vibrate(12);
});
elem.addEventListener("touchend", function () {
  elem.style.background = "transparent";
});
```

In the code above, we are using the vibration API in the most basic way, with only one argument for the number of milliseconds that the vibration can last. Alternatively, the vibration API can take an array of values providing alternating times for vibrating on and off. But a single, very short number of milliseconds appears to work best for providing a small vibration, giving the user the right amount of feedback for their actions. In the example above, you can see I'm telling the device to vibrate for only 12 milliseconds, and this felt a lot like the standard haptic feedback for the virtual keyboard on Android.

The Future: Motion Capture
--------------------------

With Internet Explorer shipping with the Xbox 360's new Windows 8 update, it won't be long until we see users attempting to control web interfaces with the Kinect. Further, [the Leap] [25], which provides the ability to capture fine motor movements, may prove to be an excellent way to interact with web interfaces originally designed for mouse, touch and stylus.

[25]: https://leapmotion.com/

We don't know yet what events the Kinect or the Leap might trigger within the DOM, but perhaps Internet Explorer's new pointer events will be able to be used with these devices as well. Pointer events are certainly the most versatile and flexible event model we have to date, and might be able to be leveraged within a motion capture context.

Here at Hot Studio, we are excited to explore what might happen with these devices on the Web, and plan to conduct experiments with the Xbox 360 after we get our hands on the Windows 8 update. Check back soon to see what we find out!