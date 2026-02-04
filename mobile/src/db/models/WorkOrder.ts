import { Model } from '@nozbe/watermelondb'
import { field, children, date, readonly, text } from '@nozbe/watermelondb/decorators'
import ChecklistItem from './ChecklistItem'

export default class WorkOrder extends Model {
  static table = 'work_orders'
  static associations = {
    checklist_items: { type: 'has_many', foreignKey: 'work_order_id' },
  } as const

  @text('title') title!: string
  @text('subtitle') subtitle!: string
  @text('status') status!: string
  @text('priority') priority!: string
  @text('asset_id') assetId!: string
  @readonly @date('created_at') createdAt!: Date
  @readonly @date('updated_at') updatedAt!: Date
  @children('checklist_items') checklistItems!: any
}
