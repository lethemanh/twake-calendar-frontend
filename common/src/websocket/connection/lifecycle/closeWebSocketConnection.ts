import { WebSocketWithCleanup } from '@common/websocket/connection/types'

export function closeWebSocketConnection(
  socketRef: React.MutableRefObject<WebSocketWithCleanup | null>,
  setIsSocketOpen: (value: boolean) => void
) {
  if (socketRef.current) {
    socketRef.current.cleanup()
    socketRef.current.close()
    socketRef.current = null
    setIsSocketOpen(false)
  }
}
