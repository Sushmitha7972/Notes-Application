import logging
import os

# Ensure logs directory exists
if not os.path.exists("logs"):
    os.makedirs("logs")

# Configure logging
logging.basicConfig(
    filename="logs/app.log",  #Log file location
    level=logging.INFO,  #Log only INFO level and above
    format="%(asctime)s - %(levelname)s - %(message)s",  #Log format
    datefmt="%Y-%m-%d %H:%M:%S",
)

# Create a logger instance
logger = logging.getLogger(__name__)