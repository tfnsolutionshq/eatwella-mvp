import axios from 'axios';

// Hardcoded identity API base URL (production)
const API_BASE_URL = 'https://identity.smt.tfnsolutions.us/api/v1';

const createApiClient = (token) => {
  return axios.create({
    baseURL: API_BASE_URL,
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });
};

export const userAPI = {
  getUsers: async (filters = {}, token) => {
    const apiClient = createApiClient(token);
    const params = {};
    
    if (filters.search) params.search = filters.search;
    if (filters.role) params.role = filters.role;
    if (filters.status !== undefined && filters.status !== '') params.status = filters.status;
    if (filters.department) params.department = filters.department;
    
    const response = await apiClient.get('/users', { params });
    return response.data;
  },
  
  getUserById: async (userId, token) => {
    const apiClient = createApiClient(token);
    const response = await apiClient.get(`/users/${userId}`);
    return response.data;
  }
};

export const roleAPI = {
  getRoles: async (token) => {
    const apiClient = createApiClient(token);
    const response = await apiClient.get('/roles');
    return response.data;
  },
  
  getAvailablePermissions: async (token) => {
    const apiClient = createApiClient(token);
    const response = await apiClient.get('/roles/permissions/available');
    return response.data;
  }
};

export const departmentAPI = {
  getDepartments: async (token) => {
    const apiClient = createApiClient(token);
    const response = await apiClient.get('/departments');
    return response.data;
  },
  
  getDepartmentStats: async (token) => {
    const apiClient = createApiClient(token);
    const response = await apiClient.get('/departments/statistics');
    return response.data;
  },
  
  createDepartment: async (departmentData, token) => {
    const apiClient = createApiClient(token);
    const response = await apiClient.post('/departments', departmentData);
    return response.data;
  },
  
  updateDepartment: async (departmentId, departmentData, token) => {
    const apiClient = createApiClient(token);
    const params = {
      ...departmentData,
      department_id: departmentId
    };
    const response = await apiClient.put(`/departments/${departmentId}`, null, { params });
    return response.data;
  },
  
  deleteDepartment: async (departmentId, token) => {
    const apiClient = createApiClient(token);
    const response = await apiClient.delete(`/departments/${departmentId}`);
    return response.data;
  }
};

const createMemoApiClient = (token) => {
  return axios.create({
    baseURL: import.meta.env.VITE_MEMO_API_BASE_URL || '/memo-api',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });
};

export const categoryAPI = {
  getCategories: async (token) => {
    const apiClient = createMemoApiClient(token);
    const response = await apiClient.get('/categories');
    return response.data;
  },
  
  deleteCategory: async (categoryId, token) => {
    const apiClient = createMemoApiClient(token);
    const response = await apiClient.delete(`/categories/${categoryId}`);
    return response.data;
  }
};

export const workflowAPI = {
  createWorkflow: async (workflowData, token) => {
    const apiClient = createMemoApiClient(token);
    const response = await apiClient.post('/workflows', workflowData);
    return response.data;
  },
  
  getWorkflows: async (token) => {
    const apiClient = createMemoApiClient(token);
    const response = await apiClient.get('/workflows');
    return response.data;
  },
  
  getWorkflow: async (workflowId, token) => {
    const apiClient = createMemoApiClient(token);
    const response = await apiClient.get(`/workflows/${workflowId}`);
    return response.data;
  },
  
  updateWorkflow: async (workflowId, workflowData, token) => {
    const apiClient = createMemoApiClient(token);
    const response = await apiClient.put(`/workflows/${workflowId}`, workflowData);
    return response.data;
  },
  
  deleteWorkflow: async (workflowId, token) => {
    const apiClient = createMemoApiClient(token);
    const response = await apiClient.delete(`/workflows/${workflowId}`);
    return response.data;
  },
  
  toggleWorkflowStatus: async (workflowId, token) => {
    const apiClient = createMemoApiClient(token);
    const response = await apiClient.put(`/workflows/${workflowId}/toggle-status`);
    return response.data;
  },
  
  getActiveWorkflows: async (token) => {
    const apiClient = createMemoApiClient(token);
    const response = await apiClient.get('/workflows/active');
    return response.data;
  }
};

export const memoAPI = {
  createMemo: async (memoData, token) => {
    const apiClient = createMemoApiClient(token);
    const hasAttachments = Array.isArray(memoData?.attachments) && memoData.attachments.length > 0
    if (hasAttachments) {
      const fd = new FormData()
      fd.append('subject', memoData.subject || '')
      fd.append('body', memoData.body || '')
      fd.append('status', memoData.status || 'sent')
      fd.append('is_public', memoData.is_public ? '1' : '0')
      if (memoData.workflow_id !== null && memoData.workflow_id !== undefined) {
        fd.append('workflow_id', String(memoData.workflow_id))
      }
      if (memoData.category_id !== undefined && memoData.category_id !== null) {
        fd.append('category_id', String(memoData.category_id))
      }
      if (memoData.priority) {
        fd.append('priority', memoData.priority)
      }
      if (memoData.scheduled_for) {
        fd.append('scheduled_for', memoData.scheduled_for)
      }
      if (Array.isArray(memoData.recipients)) {
        memoData.recipients.forEach((rec, idx) => {
          if (rec?.recipient_id !== undefined) {
            fd.append(`recipients[${idx}][recipient_id]`, String(rec.recipient_id))
          }
          if (rec?.recipient_type !== undefined) {
            fd.append(`recipients[${idx}][recipient_type]`, String(rec.recipient_type))
          }
          if (rec?.recipient_role !== undefined) {
            fd.append(`recipients[${idx}][recipient_role]`, String(rec.recipient_role))
          }
        })
      }
      memoData.attachments.forEach((file) => {
        if (file) fd.append('attachments[]', file)
      })
      const response = await apiClient.post('/memos', fd, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      return response.data
    } else {
      const response = await apiClient.post('/memos', memoData)
      return response.data
    }
  },
  updateMemo: async (memoId, memoData, token) => {
    const apiClient = createMemoApiClient(token)
    const hasAttachments = Array.isArray(memoData?.attachments) && memoData.attachments.length > 0
    const useMultipart = hasAttachments || true
    if (useMultipart) {
      const fd = new FormData()
      if (memoData.subject !== undefined) fd.append('subject', memoData.subject || '')
      if (memoData.body !== undefined) fd.append('body', memoData.body || '')
      if (memoData.status) fd.append('status', memoData.status)
      fd.append('is_public', memoData.is_public ? '1' : '0')
      if (memoData.workflow_id !== null && memoData.workflow_id !== undefined) {
        fd.append('workflow_id', String(memoData.workflow_id))
      }
      if (memoData.category_id !== undefined && memoData.category_id !== null) {
        fd.append('category_id', String(memoData.category_id))
      }
      if (memoData.priority) {
        fd.append('priority', memoData.priority)
      }
      if (memoData.scheduled_for) {
        fd.append('scheduled_for', memoData.scheduled_for)
      }
      if (Array.isArray(memoData.recipients)) {
        memoData.recipients.forEach((rec, idx) => {
          if (rec?.recipient_id !== undefined) {
            fd.append(`recipients[${idx}][recipient_id]`, String(rec.recipient_id))
          }
          if (rec?.recipient_type !== undefined) {
            fd.append(`recipients[${idx}][recipient_type]`, String(rec.recipient_type))
          }
          if (rec?.recipient_role !== undefined) {
            fd.append(`recipients[${idx}][recipient_role]`, String(rec.recipient_role))
          }
        })
      }
      if (hasAttachments) {
        memoData.attachments.forEach((file) => {
          if (file) fd.append('attachments[]', file)
        })
      }
      const response = await apiClient.post(`/memos/${memoId}/update`, fd, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      return response.data
    } else {
      const response = await apiClient.post(`/memos/${memoId}/update`, memoData)
      return response.data
    }
  },
  
  getMemo: async (memoId, token) => {
    const apiClient = createMemoApiClient(token);
    const response = await apiClient.get(`/memos/${memoId}`);
    return response.data;
  },
  
  pinMemo: async (memoId, token) => {
    const apiClient = createMemoApiClient(token);
    const response = await apiClient.post(`/memos/${memoId}/pin`);
    return response.data;
  },
  
  starMemo: async (memoId, token) => {
    const apiClient = createMemoApiClient(token);
    const response = await apiClient.post(`/memos/${memoId}/star`);
    return response.data;
  },
  
  archiveMemo: async (memoId, token) => {
    const apiClient = createMemoApiClient(token);
    const response = await apiClient.post(`/memos/${memoId}/archive`);
    return response.data;
  },
  
  deleteMemo: async (memoId, token) => {
    const apiClient = createMemoApiClient(token);
    const response = await apiClient.delete(`/memos/${memoId}`);
    return response.data;
  },
  
  getDrafts: async (token) => {
    const apiClient = createMemoApiClient(token);
    const response = await apiClient.get('/mailbox/drafts');
    return response.data;
  },
  
  getArchived: async (token) => {
    const apiClient = createMemoApiClient(token);
    const response = await apiClient.get('/mailbox/archived');
    return response.data;
  }
};
