{ pkgs }: {
  deps = [
    pkgs.nodejs_20
    pkgs.nodePackages.pnpm
    pkgs.python312
    pkgs.watchman
    pkgs.jdk17
    pkgs.android-tools
  ];
  
  env = {
    JAVA_HOME = "${pkgs.jdk17}";
    ANDROID_HOME = "/home/runner/.android";
    PATH = "$PATH:$ANDROID_HOME/platform-tools:$ANDROID_HOME/tools:$ANDROID_HOME/tools/bin";
  };
}
