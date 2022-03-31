FROM python:alpine3.10
WORKDIR /app 
COPY . /app
RUN mkdir . /share
RUN pip install -r requirements.txt
EXPOSE 5010
CMD python ./app.py
