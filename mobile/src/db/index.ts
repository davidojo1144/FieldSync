import { Database } from '@nozbe/watermelondb'
import LokiJSAdapter from '@nozbe/watermelondb/adapters/lokijs'

import schema from './schema'
import WorkOrder from './models/WorkOrder'
import ChecklistItem from './models/ChecklistItem'

// Use LokiJSAdapter for Expo Go compatibility (Pure JS, no native JSI required)
const adapter = new LokiJSAdapter({
  schema,
  useWebWorker: false,
  useIncrementalIndexedDB: true,
  onSetUpError: error => {
    console.error('Database failed to load', error)
  }
})

const database = new Database({
  adapter,
  modelClasses: [
    WorkOrder,
    ChecklistItem,
  ],
})

export default database
