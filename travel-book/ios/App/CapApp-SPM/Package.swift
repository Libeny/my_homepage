// swift-tools-version: 5.9
import PackageDescription

// DO NOT MODIFY THIS FILE - managed by Capacitor CLI commands
// 注意：依赖已指向本地包 ios/Frameworks/capacitor-local（含离线 xcframework），
// 因为本机 SPM 无法直连 GitHub 下载二进制。cap sync 若重写此文件需改回。
let package = Package(
    name: "CapApp-SPM",
    platforms: [.iOS(.v15)],
    products: [
        .library(
            name: "CapApp-SPM",
            targets: ["CapApp-SPM"])
    ],
    dependencies: [
        .package(path: "../../Frameworks/capacitor-local")
    ],
    targets: [
        .target(
            name: "CapApp-SPM",
            dependencies: [
                .product(name: "Capacitor", package: "capacitor-local"),
                .product(name: "Cordova", package: "capacitor-local")
            ]
        )
    ]
)
