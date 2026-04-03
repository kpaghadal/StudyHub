import { apiFetch, parseResponse } from '../utils/api';

export const getGroups = async () => {
  const res = await apiFetch(`/groups`);
  return parseResponse(res);
};

export const createGroup = async (groupData) => {
  const res = await apiFetch(`/groups`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(groupData)
  });
  return parseResponse(res);
};

export const updateGroup = async (id, groupData) => {
  const res = await apiFetch(`/groups/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(groupData)
  });
  return parseResponse(res);
};

export const deleteGroup = async (id) => {
  const res = await apiFetch(`/groups/${id}`, { method: 'DELETE' });
  return parseResponse(res);
};

export const joinGroup = async (id, userId) => {
  const res = await apiFetch(`/groups/${id}/join`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId })
  });
  return parseResponse(res);
};
