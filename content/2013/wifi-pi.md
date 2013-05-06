WiFi Pi
=======

Getting WiFi to work on the Raspberry Pi can be somewhat confusing.  There are a great many differing articles floating around the web.

This solution eschews the wpa_supplicant method, which is probably more secure (?), in favor of doing something simple and easy.

Basically, this should be your /etc/network/interfaces file:

```
auto lo
iface lo inet loopback

iface eth0 inet dhcp

auto wlan0
allow-hotplug wlan0
iface wlan0 inet dhcp

wpa-ssid "your-wifi-network-name-also-known-as-the-SSID"
wpa-psk "your-password"
```