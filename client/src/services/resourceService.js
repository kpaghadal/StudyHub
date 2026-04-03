import { apiFetch, parseResponse } from '../utils/api';

export const getResources = async () => {
  const res = await apiFetch(`/resources`);
  return parseResponse(res);
};

export const createResource = async (resourceData) => {
  let res;
  if (resourceData.file) {
    const fd = new FormData();
    fd.append('file', resourceData.file);
    fd.append('title', resourceData.title);
    fd.append('type', resourceData.type);
    fd.append('author', resourceData.author || 'Scholar');
    fd.append('authorId', resourceData.authorId || '');
    fd.append('groupId', resourceData.groupId);
    fd.append('description', resourceData.description || '');
    fd.append('tags', JSON.stringify(resourceData.tags || []));
    
    res = await apiFetch(`/resources/upload`, { method: 'POST', body: fd });
  } else {
    res = await apiFetch(`/resources`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(resourceData)
    });
  }
  return parseResponse(res);
};

export const deleteResource = async (id) => {
  const res = await apiFetch(`/resources/${id}`, { method: 'DELETE' });
  return parseResponse(res);
};
