import uvicorn
from app.main import app
import logging

if __name__ == "__main__":  
    print("is it even?")
    try:
    # your application startup code here
        logging.basicConfig(level=logging.DEBUG, format='%(asctime)s %(levelname)s: %(message)s')
        uvicorn.run(app, host="127.0.0.1", port=5000, reload=True)
    except Exception as e:
        print(f"Application failed to start: {e}")