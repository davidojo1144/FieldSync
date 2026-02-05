import axios from 'axios'
import baseUrl from './api'

const http = axios.create({
  baseURL: baseUrl,
  headers: { 'Content-Type': 'application/json' },
})

export default http
