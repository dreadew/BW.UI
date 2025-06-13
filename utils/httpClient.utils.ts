class HttpClient {
  async request<T>(url: string, options: RequestInit & { signal?: AbortSignal } = {}): Promise<T> {
    const token = tokenManager?.getAccessToken();
    if (token) {
      options.headers = {
        ...options.headers,
        Authorization: `Bearer ${token}`,
      };
    }

    const response = await fetch(url, {
      ...options,
      credentials: "include",
      signal: options.signal,
    });

    if (!response.ok) {
      const errorData = await this.parseResponseData(response);
      const error: any = new Error(errorData?.message || "Неизвестная ошибка");
      error.status = response.status;
      error.data = errorData;
      throw error;
    }

    const data = await this.parseResponseData(response);
    return data as T;
  }

  async get<T>(url: string, options: RequestInit & { signal?: AbortSignal } = {}): Promise<T> {
    return this.request<T>(url, { ...options, method: "GET" });
  }

  async post<TResponse, TBody>(
    url: string,
    body?: TBody,
    options: RequestInit & { signal?: AbortSignal } = {}
  ): Promise<TResponse> {
    const isFormData = body instanceof FormData;

    const headers = {
      ...options.headers,
      ...(isFormData ? {} : { "Content-Type": "application/json" }),
    };

    return this.request<TResponse>(url, {
      ...options,
      method: "POST",
      headers,
      body: isFormData ? body : JSON.stringify(body),
    });
  }

  async put<T>(url: string, body?: any, options: RequestInit & { signal?: AbortSignal } = {}): Promise<T> {
    return this.request<T>(url, {
      ...options,
      method: "PUT",
      headers: {
        ...options.headers,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
  }

  async patch<T>(
    url: string,
    body?: any,
    options: RequestInit & { signal?: AbortSignal } = {}
  ): Promise<T> {
    return this.request<T>(url, {
      ...options,
      method: "PATCH",
      headers: {
        ...options.headers,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
  }

  async delete<T>(url: string, options: RequestInit & { signal?: AbortSignal } = {}): Promise<T> {
    return this.request<T>(url, { ...options, method: "DELETE" });
  }

  private async parseResponseData(response: Response): Promise<any> {
    const contentType = response.headers.get("Content-Type");

    if (!contentType) {
      return null;
    }

    if (contentType.includes("application/json")) {
      return response.json();
    }

    if (contentType.includes("text/plain")) {
      return response.text();
    }

    return null;
  }
}

export const httpClient = new HttpClient();