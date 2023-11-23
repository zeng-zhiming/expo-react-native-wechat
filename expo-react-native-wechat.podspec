# expo-react-native-wechat.podspec

require "json"

package = JSON.parse(File.read(File.join(__dir__, "package.json")))

Pod::Spec.new do |s|
  s.name         = "expo-react-native-wechat"
  s.version      = package["version"]
  s.summary      = package["description"]
  s.description  = <<-DESC
                  expo-react-native-wechat
                   DESC
  s.homepage     = "https://github.com/zeng-zhiming/expo-react-native-wechat"
  # brief license entry:
  s.license      = "MIT"
  # optional - use expanded license entry instead:
  # s.license    = { :type => "MIT", :file => "LICENSE" }
  s.authors      = { "zeng-zhiming" => "171314432@qq.com" }
  s.platforms    = { :ios => "9.0" }
  s.source       = { :git => "https://github.com/zeng-zhiming/expo-react-native-wechat.git", :tag => "#{s.version}" }

  s.source_files = "ios/**/*.{h,c,cc,cpp,m,mm,swift}"
  s.requires_arc = true

  s.dependency "React"
  s.dependency 'WechatOpenSDK-XCFramework'
  # ...
  # s.dependency "..."
end

