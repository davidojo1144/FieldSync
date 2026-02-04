import { Database } from '@nozbe/watermelondb'
import SQLiteAdapter from '@nozbe/watermelondb/adapters/sqlite'

import schema from './schema'
import WorkOrder from './models/WorkOrder'
import ChecklistItem from './models/ChecklistItem'

const adapter = new SQLiteAdapter({
  schema,
  jsi: true,
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
