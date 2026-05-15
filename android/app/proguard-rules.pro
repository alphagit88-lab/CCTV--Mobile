# Keep VLC classes from being stripped or renamed
-keep class org.videolan.** { *; }
-dontwarn org.videolan.**

# Keep React Native bridge methods and native methods
-keepclassmembers class * {
    @com.facebook.react.bridge.ReactMethod *;
    @com.facebook.react.uimanager.annotations.ReactProp *;
    @com.facebook.react.uimanager.annotations.ReactPropGroup *;
    native <methods>;
}

# Keep the VLC wrapper classes
-keep class com.yuanzhou.vlc.** { *; }
-dontwarn com.yuanzhou.vlc.**
