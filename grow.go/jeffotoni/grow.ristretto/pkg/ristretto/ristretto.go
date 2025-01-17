package ristretto

import (
	"github.com/dgraph-io/ristretto"
	"log"
	"sync"
	//"time"
)

var (
	once      sync.Once
	cacheOnce *ristretto.Cache
	err       error
)

func Run() *ristretto.Cache {
	once.Do(func() {
		if cacheOnce != nil {
			return
		}
		cacheOnce, err = ristretto.NewCache(&ristretto.Config{
			NumCounters: 1e7,     // Num keys to track frequency of (30M).
			MaxCost:     1 << 30, // Maximum cost of cache (1GB).
			BufferItems: 64,      // Number of keys per Get buffer.
		})
		if err != nil {
			log.Println(err.Error())
			return
		}
	})
	return cacheOnce
}

func Set(key, value string) bool {
	if len(key) < 0 || len(value) < 0 {
		return false
	}
	cache := Run()
	cache.Set(key, value, 1)
	return true
}

func Get(key string) string {
	if len(key) <= 0 {
		return ""
	}
	cache := Run()
	value, found := cache.Get(key)
	if !found {
		return ""
	}
	return value.(string)
}

func Del(key string) {
	if len(key) <= 0 {
		return
	}
	cache := Run()
	cache.Del(key)
}