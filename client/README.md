# Client Side Readme
This is the Cordova part of the project which is run on the users device.

##Initial Set Up
Since we restructured a bit of work is necessary to get things back in working order. All steps assume you already have Cordova, the Android SDK, and of course the Java SDK installed.

1. Using your favourite command line interface, navigate to this client folder.
  * ie /Users/username/Documents/School/CPSC 410/GitHub/client
2. Run 'cordova platforms ls'
  * If you have previously set this project up, it will say "Installed platforms: android 4.1.1" (or similar).
3. Run 'cordova platform rm android'
  * Need to do this because the current platform setup points to the old directory
4. Run 'cordova platform add android'
5. Run 'cordova build'

##Running on a device
Feelin' dangerous? Run this bad boy on your phone!

1. Make sure 'adb' is in your bash profile.
  * Not sure? Type run 'adb' and see what happens
2. Enable "Android Debugging" from the "Developer options" menu of your phone
  * Tip: Can't see "Developer options" in the Settings menu? Go to "About phone" and spam click the hell out of "Build number"
2. Plug in your phone, run 'adb devices' to ensure your device is ready
2. From the root of the client run 'cordova run android'
