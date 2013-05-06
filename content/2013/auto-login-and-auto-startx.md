# Auto Login and Auto StartX

## Setting up the Raspberry Pi to automatically login

Auto Login is very useful if you simply want to have your WiFi-enabled Raspberry Pi just sitting around somewhere, and you only interact with it via SSH.  No monitor or keyboard required.

Comment out the line that looks like this:

```
1:2345:respawn:/sbin/getty 115200 tty1
```

And replace it by adding this just below:

```
1:2345:respawn:/bin/login -f pi tty1 </dev/tty1 >/dev/tty1 2>&1
```

Now your Raspberry Pi can boot up, and you will be able to SSH into it immediately.

## Setting up the Raspberry Pi to automatically launch the desktop GUI

Auto StartX is great if you want to dispense with the command line interface and use the desktop GUI instead.  You will go straight into the GUI as soon as you boot the Pi.  Command line begone!

After setting up auto login, put this in /etc/rc.local, scroll to the bottom and find this:

```
exit 0
```

Just above that, add this line:

```
su -l pi -c startx
```

I got this information here: http://elinux.org/RPi_Debian_Auto_Login