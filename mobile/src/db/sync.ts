import { synchronize } from '@nozbe/watermelondb/sync'
import database from './index'
import http from '../config/http'

export async function syncData() {
  await synchronize({
    database,
    pullChanges: async ({ lastPulledAt, schemaVersion, migration }) => {
      const { data } = await http.get('/sync', {
        params: {
          last_pulled_at: lastPulledAt || 0,
          schema_version: schemaVersion,
          migration: JSON.stringify(migration),
        }
      })
      const { changes, timestamp } = data
      return { changes, timestamp }
    },
    pushChanges: async ({ changes, lastPulledAt }) => {
      await http.post('/sync', { changes }, {
        params: { last_pulled_at: lastPulledAt || 0 }
      })
    },
    migrationsEnabledAtVersion: 1,
  })
}
