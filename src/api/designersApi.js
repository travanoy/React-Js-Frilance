import { client } from './client.js';

export async function fetchDesigners(params = {}) {
  return client.get(`/designers${Object.keys(params).length ? `?${new URLSearchParams(params).toString()}` : ''}`);
}

export async function fetchDesigner(id) {
  return client.get(`/designers/${id}`);
}

export async function fetchDesignerProjects(id) {
  return client.get(`/designers/${id}/projects`);
}

export async function fetchDesignerServices(id) {
  return client.get(`/designers/${id}/services`);
}

export async function fetchDesignerReviews(id) {
  return client.get(`/designers/${id}/reviews`);
}
