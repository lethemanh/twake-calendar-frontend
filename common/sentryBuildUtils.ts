import { sentryWebpackPlugin } from '@sentry/webpack-plugin'
import fs from 'fs'
import path from 'path'
import vm from 'vm'

function loadPublicEnvVars(): Record<string, string | undefined> {
  const candidatePaths = [
    path.resolve(process.cwd(), 'public/.env.js'),
    path.resolve(process.cwd(), '../../public/.env.js'),
    path.resolve(__dirname, '../public/.env.js')
  ]

  for (const envPath of candidatePaths) {
    try {
      if (fs.existsSync(envPath)) {
        const content = fs.readFileSync(envPath, 'utf-8')
        const context: Record<string, string | undefined> = {}
        vm.runInNewContext(content, context)
        return context
      }
    } catch (error) {
      console.error(`Error while parsing env:`, error)
    }
  }

  return {}
}

/**
 * Utility function to configure and attach the Sentry Webpack/Rspack plugin to Rsbuild.
 *
 * @param appendPlugins Function provided by Rsbuild tools.rspack context to register Rspack plugins
 * @param outputDir The directory where build outputs are placed (defaults to 'dist')
 */
export function setupSentryPlugin(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  appendPlugins: (plugin: any) => void,
  outputDir: string = 'dist'
): void {
  const publicEnv = loadPublicEnvVars()

  const authToken = process.env.SENTRY_AUTH_TOKEN
  const org = publicEnv.SENTRY_ORG
  const project = publicEnv.SENTRY_PROJECT
  const sentryUrl = publicEnv.SENTRY_URL

  const hasSentryConfig = Boolean(authToken && org && project)
  // Early return if Sentry is not configured at all
  if (!hasSentryConfig) {
    return
  }

  const cleanOutputDir = outputDir.replace(/\/+$/, '')

  appendPlugins(
    sentryWebpackPlugin({
      url: sentryUrl,
      org,
      project,
      authToken,
      telemetry: false,
      sourcemaps: {
        filesToDeleteAfterUpload: `${cleanOutputDir}/**/*.map`
      }
    })
  )
}
