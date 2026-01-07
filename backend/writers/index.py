"""
API для управления писателями в литературном календаре
Поддерживает: создание, чтение, обновление, удаление, поиск писателей
"""
import json
import os
import psycopg2
from psycopg2.extras import RealDictCursor

def get_db_connection():
    """Создать подключение к базе данных"""
    return psycopg2.connect(os.environ['DATABASE_URL'])

def handler(event, context):
    """Главный обработчик HTTP-запросов"""
    method = event.get('httpMethod', 'GET')
    
    # CORS headers
    cors_headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, X-Authorization',
        'Content-Type': 'application/json'
    }
    
    if method == 'OPTIONS':
        return {'statusCode': 200, 'headers': cors_headers, 'body': ''}
    
    try:
        if method == 'GET':
            return handle_get(event, cors_headers)
        elif method == 'POST':
            return handle_post(event, cors_headers)
        elif method == 'PUT':
            return handle_put(event, cors_headers)
        elif method == 'DELETE':
            return handle_delete(event, cors_headers)
        else:
            return {
                'statusCode': 405,
                'headers': cors_headers,
                'body': json.dumps({'error': 'Method not allowed'})
            }
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': cors_headers,
            'body': json.dumps({'error': str(e)})
        }

def handle_get(event, headers):
    """Получить писателей с фильтрацией и поиском"""
    params = event.get('queryStringParameters') or {}
    search = params.get('search', '').strip()
    month = params.get('month')
    day = params.get('day')
    tag = params.get('tag')
    
    conn = get_db_connection()
    cursor = conn.cursor(cursor_factory=RealDictCursor)
    
    query = "SELECT * FROM writers WHERE 1=1"
    query_params = []
    
    if search:
        query += " AND name ILIKE %s"
        query_params.append(f'%{search}%')
    
    if month:
        query += " AND month = %s"
        query_params.append(int(month))
    
    if day:
        query += " AND day = %s"
        query_params.append(int(day))
    
    if tag:
        query += " AND %s = ANY(tags)"
        query_params.append(tag)
    
    query += " ORDER BY month, day, name"
    
    cursor.execute(query, query_params)
    writers = cursor.fetchall()
    
    cursor.close()
    conn.close()
    
    return {
        'statusCode': 200,
        'headers': headers,
        'body': json.dumps([dict(w) for w in writers], default=str)
    }

def handle_post(event, headers):
    """Создать нового писателя"""
    data = json.loads(event.get('body', '{}'))
    
    name = data.get('name', '').strip()
    info = data.get('info', '')
    image_url = data.get('imageUrl', '')
    month = data.get('month')
    day = data.get('day')
    tags = data.get('tags', [])
    
    if not name or not month or not day:
        return {
            'statusCode': 400,
            'headers': headers,
            'body': json.dumps({'error': 'Name, month and day are required'})
        }
    
    conn = get_db_connection()
    cursor = conn.cursor(cursor_factory=RealDictCursor)
    
    cursor.execute(
        """
        INSERT INTO writers (name, info, image_url, month, day, tags)
        VALUES (%s, %s, %s, %s, %s, %s)
        RETURNING *
        """,
        (name, info, image_url, month, day, tags)
    )
    
    writer = cursor.fetchone()
    conn.commit()
    cursor.close()
    conn.close()
    
    return {
        'statusCode': 201,
        'headers': headers,
        'body': json.dumps(dict(writer), default=str)
    }

def handle_put(event, headers):
    """Обновить писателя"""
    data = json.loads(event.get('body', '{}'))
    writer_id = data.get('id')
    
    if not writer_id:
        return {
            'statusCode': 400,
            'headers': headers,
            'body': json.dumps({'error': 'Writer ID is required'})
        }
    
    conn = get_db_connection()
    cursor = conn.cursor(cursor_factory=RealDictCursor)
    
    # Формируем запрос обновления только для переданных полей
    updates = []
    params = []
    
    if 'name' in data:
        updates.append('name = %s')
        params.append(data['name'])
    if 'info' in data:
        updates.append('info = %s')
        params.append(data['info'])
    if 'imageUrl' in data:
        updates.append('image_url = %s')
        params.append(data['imageUrl'])
    if 'month' in data:
        updates.append('month = %s')
        params.append(data['month'])
    if 'day' in data:
        updates.append('day = %s')
        params.append(data['day'])
    if 'tags' in data:
        updates.append('tags = %s')
        params.append(data['tags'])
    
    updates.append('updated_at = CURRENT_TIMESTAMP')
    params.append(writer_id)
    
    query = f"UPDATE writers SET {', '.join(updates)} WHERE id = %s RETURNING *"
    cursor.execute(query, params)
    
    writer = cursor.fetchone()
    conn.commit()
    cursor.close()
    conn.close()
    
    if not writer:
        return {
            'statusCode': 404,
            'headers': headers,
            'body': json.dumps({'error': 'Writer not found'})
        }
    
    return {
        'statusCode': 200,
        'headers': headers,
        'body': json.dumps(dict(writer), default=str)
    }

def handle_delete(event, headers):
    """Удалить писателя"""
    params = event.get('queryStringParameters') or {}
    writer_id = params.get('id')
    
    if not writer_id:
        return {
            'statusCode': 400,
            'headers': headers,
            'body': json.dumps({'error': 'Writer ID is required'})
        }
    
    conn = get_db_connection()
    cursor = conn.cursor()
    
    cursor.execute("DELETE FROM writers WHERE id = %s RETURNING id", (writer_id,))
    deleted = cursor.fetchone()
    
    conn.commit()
    cursor.close()
    conn.close()
    
    if not deleted:
        return {
            'statusCode': 404,
            'headers': headers,
            'body': json.dumps({'error': 'Writer not found'})
        }
    
    return {
        'statusCode': 200,
        'headers': headers,
        'body': json.dumps({'success': True})
    }
