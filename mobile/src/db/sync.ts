import { synchronize } from '@nozbe/watermelondb/sync'
import database from './index'
import baseUrl from '../config/api'

export async function syncData() {
  await synchronize({
    database,
    pullChanges: async ({ lastPulledAt, schemaVersion, migration }) => {
      const response = await fetch(`${baseUrl}/sync?last_pulled_at=${lastPulledAt || 0}&schema_version=${schemaVersion}&migration=${encodeURIComponent(JSON.stringify(migration))}`)
      if (!response.ok) {
        throw new Error(await response.text())
      }
      const { changes, timestamp } = await response.json()
      return { changes, timestamp }
    },
    pushChanges: async ({ changes, lastPulledAt }) => {
      const response = await fetch(`${baseUrl}/sync?last_pulled_at=${lastPulledAt || 0}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ changes }),
      })
      if (!response.ok) {
        throw new Error(await response.text())
      }
    },
    migrationsEnabledAtVersion: 1,
  })
}
