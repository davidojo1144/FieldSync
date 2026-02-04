import { Model } from '@nozbe/watermelondb'
import { field, date, readonly, text, relation } from '@nozbe/watermelondb/decorators'
import WorkOrder from './WorkOrder'

export default class ChecklistItem extends Model {
  static table = 'checklist_items'
  static associations = {
    work_orders: { type: 'belongs_to', key: 'work_order_id' },
  } as const

  @text('title') title!: string
  @field('is_completed') isCompleted!: boolean
  @text('requirements') requirements!: string
  @relation('work_orders', 'work_order_id') workOrder!: any
  @readonly @date('created_at') createdAt!: Date
  @readonly @date('updated_at') updatedAt!: Date
}
