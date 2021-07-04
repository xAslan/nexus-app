const { sessionMiddleware, simpleRolesIsAuthorized } = require("blitz")

module.exports = {
  middleware: [
    sessionMiddleware({
      isAuthorized: simpleRolesIsAuthorized,
    }),
  ],
  experimental: {
    reactRoot: false,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    if (!isServer) {
      config.node = {
        fs: "empty",
      }
    }

    return config
  },
}
