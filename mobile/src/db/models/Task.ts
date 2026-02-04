import { Model, Relation } from '@nozbe/watermelondb'
import { field, relation, date, readonly } from '@nozbe/watermelondb/decorators'
import { Associations } from '@nozbe/watermelondb/Model'
import Project from './Project'

export default class Task extends Model {
  static table = 'tasks'
  static associations: Associations = {
    projects: { type: 'belongs_to', key: 'project_id' },
  }

  @field('title') title!: string
  @field('status') status!: string
  @relation('projects', 'project_id') project!: Relation<Project>
  @readonly @date('created_at') createdAt!: Date
  @readonly @date('updated_at') updatedAt!: Date
}
